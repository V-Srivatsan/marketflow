from tortoise import migrations
from tortoise.migrations import operations as ops
from tortoise.fields.base import OnDelete
from uuid import uuid4
from tortoise import fields

class Migration(migrations.Migration):
    dependencies = [('user', '0001_initial')]

    initial = True

    operations = [
        ops.CreateModel(
            name='Holding',
            fields=[
                ('id', fields.IntField(generated=True, primary_key=True, unique=True, db_index=True)),
                ('uid', fields.UUIDField(default=uuid4, unique=True)),
                ('stock', fields.ForeignKeyField('stock.Stock', source_field='stock_id', db_constraint=True, to_field='id', on_delete=OnDelete.CASCADE)),
                ('user', fields.ForeignKeyField('user.User', source_field='user_id', db_constraint=True, to_field='id', on_delete=OnDelete.CASCADE)),
                ('quantity', fields.IntField()),
                ('short_balance', fields.FloatField()),
                ('avg_price', fields.FloatField()),
            ],
            options={'table': 'holding', 'app': 'transaction', 'pk_attr': 'id'},
            bases=['BaseModel'],
        ),
        ops.CreateModel(
            name='Transaction',
            fields=[
                ('id', fields.IntField(generated=True, primary_key=True, unique=True, db_index=True)),
                ('uid', fields.UUIDField(default=uuid4, unique=True)),
                ('timestamp', fields.DatetimeField(auto_now=False, auto_now_add=True)),
                ('num_units', fields.IntField()),
                ('price', fields.FloatField()),
                ('stock', fields.ForeignKeyField('stock.Stock', source_field='stock_id', db_constraint=True, to_field='id', on_delete=OnDelete.CASCADE)),
                ('user', fields.ForeignKeyField('user.User', source_field='user_id', db_constraint=True, to_field='id', on_delete=OnDelete.CASCADE)),
            ],
            options={'table': 'transaction', 'app': 'transaction', 'pk_attr': 'id'},
            bases=['TimestampModel'],
        ),
    ]
