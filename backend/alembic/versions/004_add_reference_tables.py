"""add reference tables and restructure agreements

Revision ID: 004
Revises: 003
Create Date: 2026-02-12
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = '004'
down_revision: Union[str, None] = '003'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. Create ref_suppliers
    op.create_table(
        'ref_suppliers',
        sa.Column('code', sa.String(20), primary_key=True),
        sa.Column('name', sa.String(255), nullable=False),
    )

    # 2. Create ref_agreement_types (grid_type_enum is auto-created by create_table)
    op.create_table(
        'ref_agreement_types',
        sa.Column('code', sa.String(20), primary_key=True),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('grid', sa.Enum('PERCENT', 'FIX', name='grid_type_enum'), nullable=False),
    )

    # 3. Seed ref_suppliers
    op.execute("""
        INSERT INTO ref_suppliers (code, name) VALUES
        ('K0000001', 'ООО "Альфа Трейд"'),
        ('K0000002', 'ООО "Бета Логистика"'),
        ('K0000003', 'ЗАО "Вектор Плюс"'),
        ('K0000004', 'ООО "Гамма Снаб"'),
        ('K0000005', 'ИП Дельта'),
        ('K0000006', 'ООО "Эпсилон Групп"'),
        ('K0000007', 'АО "Зета Фуд"'),
        ('K0000008', 'ООО "Эта Маркет"'),
        ('K0000009', 'ООО "Тета Дистрибуция"'),
        ('K0000010', 'ЗАО "Йота Сервис"'),
        ('K0000011', 'ООО "Каппа Продукт"'),
        ('K0000012', 'ООО "Лямбда Оптторг"'),
        ('K0000013', 'ИП Мю Консалтинг'),
        ('K0000014', 'ООО "Ню Импорт"'),
        ('K0000015', 'АО "Кси Холдинг"'),
        ('K0000016', 'ООО "Омикрон Ритейл"'),
        ('K0000017', 'ООО "Пи Фарма"'),
        ('K0000018', 'ЗАО "Ро Инвест"'),
        ('K0000019', 'ООО "Сигма Партнёр"'),
        ('K0000020', 'ООО "Тау Снабжение"')
    """)

    # 4. Seed ref_agreement_types
    op.execute("""
        INSERT INTO ref_agreement_types (code, name, grid) VALUES
        ('P001', '% от оборота закупок', 'PERCENT'),
        ('S001', '% от оборота продаж', 'PERCENT'),
        ('F001', 'фикс, руб', 'FIX')
    """)

    # 5. Modify agreements table
    op.drop_constraint('check_rate_range', 'agreements', type_='check')
    op.drop_column('agreements', 'supplier_name')
    op.drop_column('agreements', 'agreement_type')
    op.drop_column('agreements', 'rate_percent')

    op.add_column('agreements', sa.Column(
        'supplier_code', sa.String(20), sa.ForeignKey('ref_suppliers.code'),
        nullable=False, server_default='K0000001',
    ))
    op.add_column('agreements', sa.Column(
        'agreement_type_code', sa.String(20), sa.ForeignKey('ref_agreement_types.code'),
        nullable=False, server_default='P001',
    ))
    op.add_column('agreements', sa.Column(
        'condition_value', sa.Numeric(15, 2),
        nullable=False, server_default='1',
    ))

    op.alter_column('agreements', 'supplier_code', server_default=None)
    op.alter_column('agreements', 'agreement_type_code', server_default=None)
    op.alter_column('agreements', 'condition_value', server_default=None)

    op.create_check_constraint(
        'check_condition_value_positive', 'agreements',
        'condition_value > 0',
    )

    # 6. Drop old agreement_type_enum
    sa.Enum(name='agreement_type_enum').drop(op.get_bind(), checkfirst=True)


def downgrade() -> None:
    op.drop_constraint('check_condition_value_positive', 'agreements', type_='check')
    op.drop_column('agreements', 'condition_value')
    op.drop_column('agreements', 'agreement_type_code')
    op.drop_column('agreements', 'supplier_code')

    agreement_type_enum = sa.Enum('TURNOVER_PURCHASE_PERCENT', name='agreement_type_enum')
    agreement_type_enum.create(op.get_bind(), checkfirst=True)
    op.add_column('agreements', sa.Column(
        'rate_percent', sa.Numeric(5, 2), nullable=False, server_default='1',
    ))
    op.add_column('agreements', sa.Column(
        'agreement_type', agreement_type_enum,
        nullable=False, server_default='TURNOVER_PURCHASE_PERCENT',
    ))
    op.add_column('agreements', sa.Column(
        'supplier_name', sa.String(), nullable=False, server_default='unknown',
    ))
    op.create_check_constraint(
        'check_rate_range', 'agreements',
        'rate_percent > 0 AND rate_percent <= 100',
    )

    op.drop_table('ref_agreement_types')
    sa.Enum(name='grid_type_enum').drop(op.get_bind(), checkfirst=True)
    op.drop_table('ref_suppliers')
