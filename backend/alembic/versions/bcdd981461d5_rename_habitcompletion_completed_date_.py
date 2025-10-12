"""Rename HabitCompletion.completed_date to completion_date

Revision ID: bcdd981461d5
Revises: 685f2b76e5be
Create Date: 2025-10-12 21:11:28.398502

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'bcdd981461d5'
down_revision: Union[str, Sequence[str], None] = '685f2b76e5be'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. Добавляем новое поле с временным именем и nullable=True
    op.add_column('habit_completions', sa.Column('temp_completion_date', sa.Date(), nullable=True))
    
    # 2. Копируем данные из старого поля в новое
    op.execute("UPDATE habit_completions SET temp_completion_date = completed_date")
    
    # 3. Удаляем старое поле
    op.drop_column('habit_completions', 'completed_date')
    
    # 4. Переименовываем временное поле в completion_date
    op.alter_column('habit_completions', 'temp_completion_date', new_column_name='completion_date')
    
    # 5. Устанавливаем NOT NULL (если поле не должно быть NULL)
    # ВАЖНО: Убедитесь, что в таблице НЕТ строк с NULL в completed_date
    # Если есть, сначала заполните их дефолтными значениями
    op.alter_column('habit_completions', 'completion_date', nullable=False)
    # ### end Alembic commands ###


def downgrade() -> None:
    """Downgrade schema."""
    # 1. Добавляем старое поле с временным именем и nullable=True
    op.add_column('habit_completions', sa.Column('temp_completed_date', sa.DATE(), autoincrement=False, nullable=True))
    
    # 2. Копируем данные из нового поля в старое
    op.execute("UPDATE habit_completions SET temp_completed_date = completion_date")
    
    # 3. Удаляем новое поле
    op.drop_column('habit_completions', 'completion_date')
    
    # 4. Переименовываем временное поле в completed_date
    op.alter_column('habit_completions', 'temp_completed_date', new_column_name='completed_date')
    
    # 5. Устанавливаем NOT NULL
    op.alter_column('habit_completions', 'completed_date', nullable=False)
    # ### end Alembic commands ###
