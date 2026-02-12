"""add agreement code column with sequence

Revision ID: 006
Revises: 005
Create Date: 2026-02-12
"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "006"
down_revision: Union[str, None] = "005"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. Create sequence for agreement codes
    op.execute("CREATE SEQUENCE agreement_code_seq START WITH 1 INCREMENT BY 1 NO CYCLE;")

    # 2. Add column as nullable first (for backfill)
    op.add_column(
        "agreements",
        sa.Column("code", sa.String(8), nullable=True),
    )

    # 3. Backfill existing rows ordered by created_at
    op.execute("""
        WITH numbered AS (
            SELECT id, ROW_NUMBER() OVER (ORDER BY created_at) AS rn
            FROM agreements
            WHERE code IS NULL
        )
        UPDATE agreements
        SET code = LPAD(numbered.rn::text, 8, '0')
        FROM numbered
        WHERE agreements.id = numbered.id;
    """)

    # 4. Advance sequence past backfilled values
    op.execute("""
        SELECT setval('agreement_code_seq',
            COALESCE((SELECT MAX(code::bigint) FROM agreements), 0));
    """)

    # 5. Set default from sequence
    op.execute("""
        ALTER TABLE agreements
        ALTER COLUMN code SET DEFAULT LPAD(nextval('agreement_code_seq')::text, 8, '0');
    """)

    # 6. Make NOT NULL
    op.alter_column("agreements", "code", nullable=False)

    # 7. Add unique constraint
    op.create_unique_constraint("uq_agreements_code", "agreements", ["code"])


def downgrade() -> None:
    op.drop_constraint("uq_agreements_code", "agreements", type_="unique")
    op.drop_column("agreements", "code")
    op.execute("DROP SEQUENCE IF EXISTS agreement_code_seq;")
