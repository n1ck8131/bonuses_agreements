"""add status to agreements

Revision ID: 003
Revises: 002
Create Date: 2026-02-12
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = '003'
down_revision: Union[str, None] = '002'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    agreement_status_enum = sa.Enum(
        'READY_FOR_CALCULATION', 'CALCULATED', 'DELETED',
        name='agreement_status_enum'
    )
    agreement_status_enum.create(op.get_bind(), checkfirst=True)

    op.add_column(
        'agreements',
        sa.Column(
            'status',
            agreement_status_enum,
            nullable=False,
            server_default='READY_FOR_CALCULATION',
        )
    )


def downgrade() -> None:
    op.drop_column('agreements', 'status')
    sa.Enum(name='agreement_status_enum').drop(op.get_bind(), checkfirst=True)
