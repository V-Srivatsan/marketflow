import random
import time
import numpy as np
import torch
import torch.nn as nn
import torch.optim as optim
import gymnasium as gym

from gym import MarketflowGym
from agent import Agent

def make_env():
    return lambda: MarketflowGym()

if __name__ == "__main__":
    num_envs = 4
    num_steps = 128
    total_timesteps = 300_000
    learning_rate = 3e-4
    gamma = 0.99
    gae_lambda = 0.95
    clip_coef = 0.2
    ent_coef = 0.05
    vf_coef = 0.5
    batch_size = num_envs * num_steps
    minibatch_size = batch_size // 4

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    envs = gym.vector.SyncVectorEnv([make_env() for _ in range(num_envs)])
    agent = Agent(envs).to(device)
    optimizer = optim.Adam(agent.parameters(), lr=learning_rate, eps=1e-5)

    obs = torch.zeros((num_steps, num_envs) + envs.single_observation_space.shape).to(device)
    actions = torch.zeros((num_steps, num_envs) + envs.single_action_space.shape).to(device)
    logprobs = torch.zeros((num_steps, num_envs)).to(device)
    rewards = torch.zeros((num_steps, num_envs)).to(device)
    dones = torch.zeros((num_steps, num_envs)).to(device)
    values = torch.zeros((num_steps, num_envs)).to(device)
    masks = torch.zeros((num_steps, num_envs, 11), dtype=torch.bool).to(device)

    next_obs, _ = envs.reset()
    next_obs = torch.Tensor(next_obs).to(device)
    next_done = torch.zeros(num_envs).to(device)

    num_updates = total_timesteps // batch_size

    for update in range(1, num_updates + 1):
        for step in range(0, num_steps):
            obs[step] = next_obs
            dones[step] = next_done

            # Retrieve action masks from envs
            current_masks = torch.tensor(np.array(envs.call("action_masks")), dtype=torch.bool).to(device)
            masks[step] = current_masks

            with torch.no_grad():
                action, logprob, _, value = agent.get_action_and_value(next_obs, action_mask=current_masks)
                values[step] = value.flatten()

            actions[step] = action
            logprobs[step] = logprob

            next_obs, reward, terminations, truncations, _ = envs.step(action.cpu().numpy())
            next_done_bool = np.logical_or(terminations, truncations)
            rewards[step] = torch.tensor(reward).to(device).view(-1)
            next_obs, next_done = torch.Tensor(next_obs).to(device), torch.Tensor(next_done_bool).to(device)

        # GAE Calculation
        with torch.no_grad():
            next_value = agent.get_value(next_obs).reshape(1, -1)
            advantages = torch.zeros_like(rewards).to(device)
            lastgaelam = 0
            for t in reversed(range(num_steps)):
                if t == num_steps - 1:
                    nextnonterminal = 1.0 - next_done.float()
                    nextvalues = next_value
                else:
                    nextnonterminal = 1.0 - dones[t + 1]
                    nextvalues = values[t + 1]
                delta = rewards[t] + gamma * nextvalues * nextnonterminal - values[t]
                advantages[t] = lastgaelam = delta + gamma * gae_lambda * nextnonterminal * lastgaelam
            returns = advantages + values

        # Flatten Batches
        b_obs = obs.reshape((-1,) + envs.single_observation_space.shape)
        b_logprobs = logprobs.reshape(-1)
        b_actions = actions.reshape((-1,) + envs.single_action_space.shape)
        b_masks = masks.reshape((-1, 11))
        b_advantages = advantages.reshape(-1)
        b_returns = returns.reshape(-1)

        # Optimize Policy & Value Networks
        b_inds = np.arange(batch_size)
        for epoch in range(4):
            np.random.shuffle(b_inds)
            for start in range(0, batch_size, minibatch_size):
                end = start + minibatch_size
                mb_inds = b_inds[start:end]

                _, newlogprob, entropy, newvalue = agent.get_action_and_value(
                    b_obs[mb_inds], b_actions.long()[mb_inds], action_mask=b_masks[mb_inds]
                )
                logratio = newlogprob - b_logprobs[mb_inds]
                ratio = logratio.exp()

                mb_advantages = b_advantages[mb_inds]
                mb_advantages = (mb_advantages - mb_advantages.mean()) / (mb_advantages.std() + 1e-8)

                pg_loss1 = -mb_advantages * ratio
                pg_loss2 = -mb_advantages * torch.clamp(ratio, 1 - clip_coef, 1 + clip_coef)
                pg_loss = torch.max(pg_loss1, pg_loss2).mean()

                v_loss = 0.5 * ((newvalue.flatten() - b_returns[mb_inds]) ** 2).mean()
                loss = pg_loss - ent_coef * entropy.mean() + v_loss * vf_coef

                optimizer.zero_grad()
                loss.backward()
                nn.utils.clip_grad_norm_(agent.parameters(), 0.5)
                optimizer.step()

        if update % 50 == 0:
            print(f"Update {update}/{num_updates} Complete | Loss: {loss.item():.4f}")

    torch.save(agent.state_dict(), "model.pt")
    print("Training finished! Model saved to 'model.pt'")