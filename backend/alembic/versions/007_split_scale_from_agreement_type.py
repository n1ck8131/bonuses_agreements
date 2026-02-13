"""split scale from agreement type, redesign agreement kinds

Revision ID: 007
Revises: 006
Create Date: 2026-02-13
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = '007'
down_revision: Union[str, None] = '006'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. Create ref_scales table (reuses existing grid_type_enum)
    op.execute("""
        CREATE TABLE ref_scales (
            code VARCHAR(10) PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            grid grid_type_enum NOT NULL
        )
    """)

    # 2. Seed scales
    op.execute("""
        INSERT INTO ref_scales (code, name, grid) VALUES
        ('01', '% от продаж', 'PERCENT'),
        ('02', '% от закупок', 'PERCENT'),
        ('03', 'Фиксированная сумма, руб', 'FIX')
    """)

    # 3. Add scale_code to agreements (nullable first for migration)
    op.add_column('agreements', sa.Column(
        'scale_code', sa.String(10),
        sa.ForeignKey('ref_scales.code'),
        nullable=True,
    ))

    # 4. Map existing agreements to scales based on old agreement_type grid
    op.execute("""
        UPDATE agreements SET scale_code = '03'
        WHERE agreement_type_code IN (
            SELECT code FROM ref_agreement_types WHERE grid = 'FIX'
        )
    """)
    op.execute("""
        UPDATE agreements SET scale_code = '02'
        WHERE agreement_type_code IN (
            SELECT code FROM ref_agreement_types WHERE grid = 'PERCENT' AND code = 'P001'
        )
    """)
    op.execute("""
        UPDATE agreements SET scale_code = '01'
        WHERE agreement_type_code IN (
            SELECT code FROM ref_agreement_types WHERE grid = 'PERCENT' AND code = 'S001'
        )
    """)
    # Catch-all for any remaining nulls
    op.execute("UPDATE agreements SET scale_code = '01' WHERE scale_code IS NULL")

    # 5. Make scale_code NOT NULL
    op.alter_column('agreements', 'scale_code', nullable=False)

    # 6. Remap existing agreement_type_code to T001 (before deleting old types)
    #    First insert T001 so FK is valid
    op.execute("""
        INSERT INTO ref_agreement_types (code, name, grid) VALUES
        ('T001', 'Оборотный бонус', 'PERCENT')
    """)
    op.execute("UPDATE agreements SET agreement_type_code = 'T001' WHERE agreement_type_code IN ('P001', 'S001', 'F001')")

    # 7. Delete old agreement types
    op.execute("DELETE FROM ref_agreement_types WHERE code IN ('P001', 'S001', 'F001')")

    # 8. Insert remaining new agreement types (T001 already inserted)
    op.execute("""
        INSERT INTO ref_agreement_types (code, name, grid) VALUES
        ('M001', 'Маркетинг', 'PERCENT'),
        ('P001', 'Промо', 'PERCENT'),
        ('E001', 'Extra', 'PERCENT'),
        ('E002', 'Доп. маржа', 'PERCENT')
    """)

    # 9. Drop grid column from ref_agreement_types
    op.drop_column('ref_agreement_types', 'grid')


def downgrade() -> None:
    # Re-add grid column
    op.add_column('ref_agreement_types', sa.Column(
        'grid', sa.Enum('PERCENT', 'FIX', name='grid_type_enum', create_type=False),
        nullable=True,
    ))
    op.execute("UPDATE ref_agreement_types SET grid = 'PERCENT'")
    op.alter_column('ref_agreement_types', 'grid', nullable=False)

    # Restore old types
    op.execute("DELETE FROM ref_agreement_types WHERE code IN ('T001', 'M001', 'P001', 'E001', 'E002')")
    op.execute("""
        INSERT INTO ref_agreement_types (code, name, grid) VALUES
        ('P001', '% от оборота закупок', 'PERCENT'),
        ('S001', '% от оборота продаж', 'PERCENT'),
        ('F001', 'фикс, руб', 'FIX')
    """)

    # Remap agreements back
    op.execute("UPDATE agreements SET agreement_type_code = 'P001'")

    # Drop scale_code from agreements
    op.drop_column('agreements', 'scale_code')

    # Drop ref_scales
    op.drop_table('ref_scales')
