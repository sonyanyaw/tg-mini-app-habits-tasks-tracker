"""add category to tasks

Revision ID: 086a568802ee
Revises: 5b8c3c8b5c67
Create Date: 2026-04-27 20:05:11.791263

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '086a568802ee'
down_revision: Union[str, Sequence[str], None] = '5b8c3c8b5c67'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column('tasks', sa.Column('category', sa.String(length=50), nullable=True))


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column('tasks', 'category')
