"use client";

import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import styles from "./ProfileHeader.module.css";
import Button from "@/components/ui/Button";

type Props = {
  name: string;
  username: string;
  avatarUrl?: string;
  bio: string;
  occupation?: string;
  gender?: string;
  phoneNumber?: string;
  interests?: string[];
  email: string;
  memberSince: string;
  xp: number;
  streak: number;
  avgMood: number;
  onEdit: () => void;
};

export default function ProfileHeader({ 
  name, username, avatarUrl, bio, occupation, gender, phoneNumber, interests, email, memberSince, xp, streak, avgMood, onEdit 
}: Props) {
  const initial = name ? name.charAt(0).toUpperCase() : "?";
  
  // Emoji for mood based on avg (0-100)
  let moodEmoji = "😐";
  let moodText = "Neutral";
  if (avgMood > 75) { moodEmoji = "😊"; moodText = "Happy"; }
  else if (avgMood > 40) { moodEmoji = "😌"; moodText = "Calm"; }
  else if (avgMood > 0) { moodEmoji = "😔"; moodText = "Low"; }
  if (avgMood === 0) { moodEmoji = "🌱"; moodText = "New"; } // 0 means no data

  return (
    <GlassCard className={styles.headerCard}>
      <div className={styles.topSection}>
        <div className={styles.avatarWrap}>
          <div className={styles.avatar}>
            {avatarUrl ? (
              <img src={avatarUrl} alt="Profile Avatar" className={styles.avatarImg} />
            ) : (
              initial
            )}
          </div>
        </div>
        <div className={styles.infoWrap}>
          <h1 className={styles.name}>{name || "Anonymous"}</h1>
          <p className={styles.username}>@{username || "user"}</p>
          {bio && <p className={styles.bio}>{bio}</p>}

          {/* Extended Info row */}
          {(occupation || gender || phoneNumber) && (
            <div className={styles.extendedInfo}>
              {occupation && <span className={styles.extBadge}>💼 {occupation}</span>}
              {gender && <span className={styles.extBadge}>👤 {gender}</span>}
              {phoneNumber && <span className={styles.extBadge}>📞 {phoneNumber}</span>}
            </div>
          )}

          {/* Interests Pills */}
          {interests && interests.length > 0 && (
            <div className={styles.interestsWrap}>
              {interests.map(i => (
                <span key={i} className={styles.interestPill}>{i}</span>
              ))}
            </div>
          )}

          <div className={styles.metaRow}>
            <span>📧 {email || "No email"}</span>
            <span>📅 Joined {memberSince || "recently"}</span>
          </div>
        </div>
        <div className={styles.editWrap}>
          <Button variant="secondary" onClick={onEdit}>Edit Profile</Button>
        </div>
      </div>

      <div className={styles.statsRow}>
        <div className={styles.statItem}>
          <span className={styles.statIcon}>{moodEmoji}</span>
          <div className={styles.statData}>
            <span className={styles.statValue}>{moodText}</span>
            <span className={styles.statLabel}>Current Vibe</span>
          </div>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statIcon}>⭐</span>
          <div className={styles.statData}>
            <span className={styles.statValue}>{xp.toLocaleString()} XP</span>
            <span className={styles.statLabel}>Total Experience</span>
          </div>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statIcon}>🔥</span>
          <div className={styles.statData}>
            <span className={styles.statValue}>{streak} Day</span>
            <span className={styles.statLabel}>Current Streak</span>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
