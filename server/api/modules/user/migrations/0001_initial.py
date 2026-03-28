from tortoise import migrations
from tortoise.migrations import operations as ops
from uuid import uuid4
from tortoise import fields

class Migration(migrations.Migration):
    initial = True

    operations = [
        ops.CreateModel(
            name='User',
            fields=[
                ('id', fields.IntField(generated=True, primary_key=True, unique=True, db_index=True)),
                ('uid', fields.UUIDField(default=uuid4, unique=True)),
                ('username', fields.CharField(unique=True, max_length=255)),
                ('password', fields.CharField(max_length=255)),
                ('balance', fields.FloatField()),
                ('verified', fields.BooleanField(default=False)),
            ],
            options={'table': 'user', 'app': 'user', 'pk_attr': 'id'},
            bases=['BaseModel'],
        ),
    ]
