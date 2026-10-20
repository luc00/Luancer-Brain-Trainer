import { MicroWorkoutPlan, UserProfile } from '../types';
import { getCurrentReceptivityAnalysis, getOptimalNextReminder } from './receptivityML';
import { soundFx } from './audio';

type NudgeListener = (payload: {
  plan: MicroWorkoutPlan;
  receptivityScore: number;
  reason: string;
  isTest?: boolean;
}) => void;

class SmartNotificationEngine {
  private listeners: Set<NudgeListener> = new Set();
  private scheduledTimeout: number | null = null;

  /**
   * Checks if browser push notifications are supported.
   */
  public isSupported(): boolean {
    return typeof window !== 'undefined' && 'Notification' in window;
  }

  /**
   * Gets current browser notification permission.
   */
  public getPermission(): NotificationPermission {
    if (!this.isSupported()) return 'denied';
    return Notification.permission;
  }

  /**
   * Requests permission to send desktop / mobile browser push notifications.
   */
  public async requestPermission(): Promise<NotificationPermission> {
    if (!this.isSupported()) return 'denied';
    try {
      const permission = await Notification.requestPermission();
      return permission;
    } catch {
      return 'denied';
    }
  }

  /**
   * Dispatches a native browser notification if enabled.
   */
  public sendNativeNotification(title: string, options: NotificationOptions): boolean {
    if (!this.isSupported() || Notification.permission !== 'granted') {
      return false;
    }
    try {
      const notification = new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: 'luancer-ml-micro-workout',
        ...options,
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };
      return true;
    } catch (e) {
      console.warn('Native notification dispatch failed:', e);
      return false;
    }
  }

  /**
   * Subscribes a callback to in-app smart nudge events.
   */
  public subscribe(listener: NudgeListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Broadcasts a smart nudge to all active in-app listeners.
   */
  public triggerNudge(payload: {
    plan: MicroWorkoutPlan;
    receptivityScore: number;
    reason: string;
    isTest?: boolean;
  }) {
    soundFx.playPowerUp();

    // 1. Dispatch native browser push notification if permitted
    const pushTitle = `⚡ Luancer ML: Momento di Alta Ricettività (${payload.receptivityScore}%)`;
    const pushBody = `Il tuo cervello è pronto per: "${payload.plan.title}". Durata: 60s (+${payload.plan.xpReward} XP).`;
    this.sendNativeNotification(pushTitle, {
      body: pushBody,
    });

    // 2. Notify in-app listeners
    this.listeners.forEach((listener) => listener(payload));
  }

  /**
   * Trigger immediate ML reminder test.
   */
  public triggerInstantMLReminder(profile: UserProfile): MicroWorkoutPlan {
    const analysis = getCurrentReceptivityAnalysis(profile);
    this.triggerNudge({
      plan: analysis.microWorkout,
      receptivityScore: analysis.currentScore,
      reason: analysis.actionMessage,
      isTest: true,
    });
    return analysis.microWorkout;
  }

  /**
   * Schedules automated intelligent checks based on predicted next receptive window.
   */
  public scheduleNextSmartReminder(profile: UserProfile) {
    if (this.scheduledTimeout) {
      window.clearTimeout(this.scheduledTimeout);
      this.scheduledTimeout = null;
    }

    if (!profile.reminderSettings?.notificationsEnabled) {
      return;
    }

    const { date, microWorkout, nextWindow } = getOptimalNextReminder(profile);
    const msUntil = Math.max(10000, date.getTime() - Date.now());

    // Schedule timeout capped to safe 32-bit int
    const safeMs = Math.min(msUntil, 2147483647);
    this.scheduledTimeout = window.setTimeout(() => {
      this.triggerNudge({
        plan: microWorkout,
        receptivityScore: nextWindow.probability,
        reason: `Finestra Ottimale Circadiana Raggiunta (${nextWindow.label})`,
      });
    }, safeMs);
  }
}

export const smartNotificationEngine = new SmartNotificationEngine();
