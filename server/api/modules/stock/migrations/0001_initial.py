from tortoise import migrations
from tortoise.migrations import operations as ops
from tortoise.fields.base import OnDelete
from uuid import uuid4
from tortoise import fields

class Migration(migrations.Migration):
    initial = True

    operations = [
        ops.CreateModel(
            name='Stock',
            fields=[
                ('id', fields.IntField(generated=True, primary_key=True, unique=True, db_index=True)),
                ('uid', fields.UUIDField(default=uuid4, unique=True)),
                ('name', fields.CharField(max_length=255)),
            ],
            options={'table': 'stock', 'app': 'stock', 'pk_attr': 'id'},
            bases=['BaseModel'],
        ),
        ops.CreateModel(
            name='StockEntry',
            fields=[
                ('id', fields.IntField(generated=True, primary_key=True, unique=True, db_index=True)),
                ('uid', fields.UUIDField(default=uuid4, unique=True)),
                ('timestamp', fields.DatetimeField(auto_now=False, auto_now_add=True)),
                ('stock', fields.ForeignKeyField('stock.Stock', source_field='stock_id', db_constraint=True, to_field='id', related_name='entries', on_delete=OnDelete.CASCADE)),
                ('open', fields.FloatField()),
                ('low', fields.FloatField()),
                ('high', fields.FloatField()),
                ('close', fields.FloatField()),
            ],
            options={'table': 'stockentry', 'app': 'stock', 'unique_together': (('stock', 'timestamp'),), 'pk_attr': 'id'},
            bases=['TimestampModel'],
        ),
    ]
