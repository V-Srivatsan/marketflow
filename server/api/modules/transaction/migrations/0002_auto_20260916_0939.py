from tortoise import migrations
from tortoise.migrations import operations as ops
from tortoise import fields

class Migration(migrations.Migration):
    dependencies = [('stock', '0001_initial'), ('transaction', '0001_initial'), ('user', '0001_initial')]

    initial = False

    operations = [
        ops.AlterField(
            model_name='Transaction',
            name='timestamp',
            field=fields.DatetimeField(auto_now=False, auto_now_add=False),
        ),
    ]
