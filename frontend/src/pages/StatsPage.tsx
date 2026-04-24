import React from 'react';
import { useAppSelector } from '../store';
import { useHabits } from '../hooks/useHabits';
import { type Habit, type HabitCompletion } from '../services/api';
import { formatLocalDate, generateWeekDays } from '../utils/date';
import { FireIcon } from '../components/ui/Icons';
import { StatsSkeleton } from '../components/ui/Skeletons';
import BottomNav from '../components/Layout/BottomNav';
import './stats.css';

function calculateStreak(completions: HabitCompletion[]): number {
  const completed = new Set(
    completions.filter(c => c.completed).map(c => c.completion_date)
  );

  const today = new Date();
  const todayStr = formatLocalDate(today);
  const start = completed.has(todayStr) ? today : new Date(today.getTime() - 86400000);

  let streak = 0;
  const d = new Date(start);
  while (completed.has(formatLocalDate(d))) {
    streak++;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

function monthCompletionRate(completions: HabitCompletion[]): number {
  const daysPassed = new Date().getDate();
  const completedCount = completions.filter(c => c.completed).length;
  return Math.min(100, Math.round((completedCount / daysPassed) * 100));
}

function weekCompletions(completions: HabitCompletion[]): boolean[] {
  const weekDays = generateWeekDays();
  const completed = new Set(
    completions.filter(c => c.completed).map(c => c.completion_date)
  );
  return weekDays.map(d => completed.has(formatLocalDate(d.date)));
}

const WEEK_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

const HabitStatCard: React.FC<{ habit: Habit }> = ({ habit }) => {
  const streak = calculateStreak(habit.completions ?? []);
  const rate = monthCompletionRate(habit.completions ?? []);
  const week = weekCompletions(habit.completions ?? []);

  return (
    <div className="stat-habit-card">
      <div className="stat-habit-header">
        <span className="stat-habit-title">{habit.title}</span>
        <div className="stat-streak">
          <FireIcon size={14} />
          <span className="stat-streak-count">{streak}</span>
        </div>
      </div>

      <div className="stat-week-labels">
        {WEEK_LABELS.map((l, i) => <span key={i} className="week-label">{l}</span>)}
      </div>

      <div className="stat-week-dots">
        {week.map((done, i) => (
          <div key={i} className={`week-dot ${done ? 'week-dot--done' : ''}`} />
        ))}
      </div>

      <div className="stat-progress-bar">
        <div className="stat-progress-fill" style={{ width: `${rate}%` }} />
      </div>
      <span className="stat-rate-label">{rate}% completed this month</span>
    </div>
  );
};

const StatsPage: React.FC = () => {
  const { user } = useAppSelector(s => s.auth);
  const { habits, loading } = useHabits(!!user);

  const totalStreak = habits.length
    ? Math.max(...habits.map(h => calculateStreak(h.completions ?? [])))
    : 0;

  const overallRate = habits.length
    ? Math.round(habits.reduce((sum, h) => sum + monthCompletionRate(h.completions ?? []), 0) / habits.length)
    : 0;

  return (
    <div className="stats-page">
      <div className="stats-content">
        <h1 className="stats-title">Statistics</h1>

        {loading ? <StatsSkeleton /> : (
          <>
            <div className="stats-summary">
              <div className="summary-card">
                <span className="summary-value">{habits.length}</span>
                <span className="summary-label">Active Habits</span>
              </div>
              <div className="summary-card">
                <div className="summary-streak-value">
                  <FireIcon size={20} />
                  <span className="summary-value">{totalStreak}</span>
                </div>
                <span className="summary-label">Best Streak</span>
              </div>
              <div className="summary-card">
                <span className="summary-value">{overallRate}%</span>
                <span className="summary-label">Monthly Rate</span>
              </div>
            </div>

            <h2 className="stats-section-title">Habit Details</h2>
            {habits.length === 0 ? (
              <div className="stats-empty">
                <div className="stats-empty-icon">📊</div>
                <p className="stats-empty-heading">No habits yet</p>
                <p className="stats-empty-sub">Add habits on the Home tab to start tracking your progress.</p>
              </div>
            ) : (
              <div className="stat-habits-list">
                {habits.map(h => <HabitStatCard key={h.id} habit={h} />)}
              </div>
            )}
          </>
        )}
      </div>
      <BottomNav />
    </div>
  );
};

export default StatsPage;
