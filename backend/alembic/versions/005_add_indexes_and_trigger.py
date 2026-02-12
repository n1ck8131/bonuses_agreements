"""add indexes and updated_at trigger

Revision ID: 005
Revises: 004
Create Date: 2026-02-12
"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "005"
down_revision: Union[str, None] = "004"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Indexes for query performance
    op.create_index("ix_agreements_created_at", "agreements", [sa.text("created_at DESC")])
    op.create_index("ix_agreements_supplier_code", "agreements", ["supplier_code"])
    op.create_index("ix_agreements_agreement_type_code", "agreements", ["agreement_type_code"])
    op.create_index("ix_agreements_status", "agreements", ["status"])

    # Trigger for auto-updating updated_at
    op.execute("""
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = CURRENT_TIMESTAMP;
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
    """)
    op.execute("""
        CREATE TRIGGER trigger_agreements_updated_at
            BEFORE UPDATE ON agreements
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    """)


def downgrade() -> None:
    op.execute("DROP TRIGGER IF EXISTS trigger_agreements_updated_at ON agreements")
    op.execute("DROP FUNCTION IF EXISTS update_updated_at_column()")

    op.drop_index("ix_agreements_status", table_name="agreements")
    op.drop_index("ix_agreements_agreement_type_code", table_name="agreements")
    op.drop_index("ix_agreements_supplier_code", table_name="agreements")
    op.drop_index("ix_agreements_created_at", table_name="agreements")
