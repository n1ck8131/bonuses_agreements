"""create agreements table

Revision ID: 001
Revises:
Create Date: 2026-02-09

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '001'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Create agreements table
    op.create_table(
        'agreements',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('valid_from', sa.Date(), nullable=False),
        sa.Column('valid_to', sa.Date(), nullable=False),
        sa.Column('supplier_name', sa.String(), nullable=False),
        sa.Column('agreement_type', sa.Enum('TURNOVER_PURCHASE_PERCENT', name='agreement_type_enum'), nullable=False),
        sa.Column('rate_percent', sa.Numeric(precision=5, scale=2), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.text('CURRENT_TIMESTAMP')),
        sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.text('CURRENT_TIMESTAMP')),
        sa.CheckConstraint('valid_to >= valid_from', name='check_valid_dates'),
        sa.CheckConstraint('rate_percent > 0 AND rate_percent <= 100', name='check_rate_range'),
    )


def downgrade() -> None:
    op.drop_table('agreements')
