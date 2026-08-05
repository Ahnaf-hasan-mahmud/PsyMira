"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useActivityDashboard } from "@/lib/activityStore";
import { motion } from "framer-motion";
import styles from "./page.module.css";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";

import ProfileHeader from "@/components/profile/ProfileHeader";
import WellnessSummary from "@/components/profile/WellnessSummary";
import MoodAnalytics from "@/components/profile/MoodAnalytics";
import RecentTimeline from "@/components/profile/RecentTimeline";
import FavoriteActivities from "@/components/profile/FavoriteActivities";
import EmotionalInsights from "@/components/profile/EmotionalInsights";
import PersonalGoals from "@/components/profile/PersonalGoals";
import DataExport from "@/components/profile/DataExport";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [memberSince, setMemberSince] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  // Editable fields
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [dob, setDob] = useState("");
  const [occupation, setOccupation] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [interests, setInterests] = useState<string[]>([]);

  const INTEREST_OPTIONS = ["Reading", "Music", "Sports", "Gaming", "Traveling", "Coding", "Meditation", "Exercise", "Photography", "Movies", "Art", "Cooking", "Others"];

  const { 
    xp, streak, consistency, activities, ready,
    avgMood, mostLoggedMood, favBreathing, favStory, favGame,
    moodData, mixData
  } = useActivityDashboard();
  
  const gameRounds = activities.filter(a => a.kind === "game").length;
  const storyCount = activities.filter(a => a.kind === "story").length;
  const breathingRounds = activities.filter(a => a.kind === "breathing").length;

  const router = useRouter();

  // Badges logic (unchanged)
  const BADGES = useMemo(() => [
    { id: 'first_step', icon: '🌱', name: 'First Step', desc: 'Complete 1 activity', achieved: ready && activities.length >= 1 },
    { id: 'on_fire', icon: '🔥', name: 'On Fire', desc: 'Reach 7-day streak', achieved: ready && streak >= 7 },
    { id: 'artist', icon: '🎨', name: 'Artist', desc: 'Play 3 games', achieved: ready && gameRounds >= 3 },
    { id: 'deep_breather', icon: '🌊', name: 'Deep Breather', desc: '10 breathing sessions', achieved: ready && breathingRounds >= 10 },
    { id: 'storyteller', icon: '📚', name: 'Storyteller', desc: 'Read 3 stories', achieved: ready && storyCount >= 3 }
  ], [ready, activities.length, streak, gameRounds, breathingRounds, storyCount]);

  useEffect(() => {
    async function loadProfile() {
      const supabase = createClient();
      if (!supabase) {
        setName("Demo User");
        setLoading(false);
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        setEmail(user.email || "");
        setMemberSince(new Date(user.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short' }));
        
        const { data } = await supabase
          .from("profiles")
          .select("name, username, bio, date_of_birth, avatar_url, occupation, gender, phone_number, interests")
          .eq("id", user.id)
          .single();

        if (data) {
          if (data.name) setName(data.name);
          if (data.username) setUsername(data.username);
          if (data.bio) setBio(data.bio);
          if (data.date_of_birth) setDob(data.date_of_birth);
          if (data.avatar_url) setAvatarUrl(data.avatar_url);
          if (data.occupation) setOccupation(data.occupation);
          if (data.gender) setGender(data.gender);
          if (data.phone_number) setPhone(data.phone_number);
          if (data.interests) setInterests(data.interests);
        } else {
          setName(user.user_metadata?.name || user.email?.split("@")[0] || "User");
        }
      }
      setLoading(false);
    }
    loadProfile();
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    
    const supabase = createClient();
    if (supabase && userId) {
      await supabase
        .from("profiles")
        .upsert({
          id: userId,
          name: name,
          username: username,
          bio: bio,
          avatar_url: avatarUrl,
          occupation: occupation,
          gender: gender,
          phone_number: phone,
          interests: interests,
          date_of_birth: dob || null
        }, { onConflict: 'id' });
    }
    setSaving(false);
    setIsEditing(false);
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0 || !userId) return;
    
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    setUploadingImage(true);
    const supabase = createClient();
    
    if (supabase) {
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (!uploadError) {
        const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
        setAvatarUrl(data.publicUrl);
      } else {
        alert("Error uploading image: " + uploadError.message);
      }
    }
    setUploadingImage(false);
  }

  async function handleLogout() {
    const supabase = createClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    router.push("/sign-in");
  }

  if (loading) {
    return <div style={{ padding: "40px", textAlign: "center", color: "var(--text-secondary)" }}>Loading profile dashboard...</div>;
  }

  return (
    <motion.div 
      className={styles.container}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {!isEditing ? (
        <>
          <ProfileHeader 
            name={name}
            username={username}
            avatarUrl={avatarUrl}
            bio={bio}
            occupation={occupation}
            gender={gender}
            phoneNumber={phone}
            interests={interests}
            email={email}
            memberSince={memberSince}
            xp={xp}
            streak={streak}
            avgMood={avgMood}
            onEdit={() => setIsEditing(true)}
          />

          <WellnessSummary activities={activities} consistency={consistency} />
          
          <MoodAnalytics moodData={moodData} mixData={mixData} />
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
            <RecentTimeline activities={activities} />
            <PersonalGoals userId={userId} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
            <FavoriteActivities 
              mostLoggedMood={mostLoggedMood} 
              favBreathing={favBreathing} 
              favStory={favStory} 
              favGame={favGame} 
            />
            <EmotionalInsights mixData={mixData} />
          </div>

          {/* Achievements Section */}
          <div style={{ marginTop: "32px" }}>
            <h2 style={{ fontSize: "20px", color: "var(--text)", fontWeight: "bold", marginLeft: "8px" }}>Achievements</h2>
            <div className={styles.badgesGrid}>
              {BADGES.map(badge => (
                <div key={badge.id} className={`${styles.badge} ${badge.achieved ? styles.badgeUnlocked : styles.badgeLocked}`}>
                  <div className={styles.badgeIcon}>{badge.icon}</div>
                  <div className={styles.badgeName}>{badge.name}</div>
                  <div className={styles.badgeDesc}>{badge.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <DataExport activities={activities} />

          {/* Account Settings */}
          <div style={{ marginTop: "32px", paddingBottom: "40px" }}>
            <h2 style={{ fontSize: "20px", color: "var(--text)", fontWeight: "bold", marginLeft: "8px" }}>Account Management</h2>
            <div className={styles.settingsCard}>
              <div className={styles.settingRow}>
                <div className={styles.settingInfo}>
                  <span className={styles.settingTitle}>Sign Out</span>
                  <span className={styles.settingDesc}>Securely log out of your PsyMira account.</span>
                </div>
                <button type="button" className={styles.logoutBtn} onClick={handleLogout}>Log Out</button>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* EDIT PROFILE MODE */
        <div>
          <div className={styles.header}>
            <h1 className={styles.title}>Edit Profile</h1>
            <p className={styles.subtitle}>Update your public and private details.</p>
          </div>
          <GlassCard>
            <form className={styles.form} onSubmit={handleSave}>
              <div className={styles.field}>
                <label className={styles.label}>Profile Photo</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  {avatarUrl && <img src={avatarUrl} alt="Avatar Preview" style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover' }} />}
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageUpload} 
                    disabled={uploadingImage} 
                    style={{ fontSize: '14px', color: 'var(--text-secondary)' }}
                  />
                  {uploadingImage && <span style={{ fontSize: '13px', color: 'var(--primary)' }}>Uploading...</span>}
                </div>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Display Name</label>
                <input type="text" className={styles.input} value={name} onChange={e => setName(e.target.value)} required />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Username</label>
                <input type="text" className={styles.input} value={username} onChange={e => setUsername(e.target.value)} placeholder="e.g. psychonaut99" />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Bio</label>
                <textarea className={styles.input} style={{ minHeight: "80px", resize: "vertical" }} value={bio} onChange={e => setBio(e.target.value)} placeholder="A short bio about your wellness journey..." />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className={styles.field}>
                  <label className={styles.label}>Occupation</label>
                  <select className={styles.input} value={occupation} onChange={e => setOccupation(e.target.value)}>
                    <option value="">Select occupation...</option>
                    <option value="Student">Student</option>
                    <option value="Healthcare / Medical">Healthcare / Medical</option>
                    <option value="Technology / Engineering">Technology / Engineering</option>
                    <option value="Education / Teaching">Education / Teaching</option>
                    <option value="Business / Finance">Business / Finance</option>
                    <option value="Creative / Design">Creative / Design</option>
                    <option value="Freelancer / Self-employed">Freelancer / Self-employed</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Gender</label>
                  <select className={styles.input} value={gender} onChange={e => setGender(e.target.value)}>
                    <option value="">Select gender...</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className={styles.field}>
                  <label className={styles.label}>Phone Number</label>
                  <input type="tel" className={styles.input} value={phone} onChange={e => setPhone(e.target.value)} placeholder="+1 (555) 000-0000" />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Date of Birth</label>
                  <input type="date" className={styles.input} value={dob} onChange={e => setDob(e.target.value)} />
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Interests (select at least one)</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '8px', marginTop: '4px' }}>
                  {INTEREST_OPTIONS.map(opt => (
                    <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                      <input 
                        type="checkbox" 
                        checked={interests.includes(opt)} 
                        onChange={() => setInterests(prev => prev.includes(opt) ? prev.filter(x => x !== opt) : [...prev, opt])}
                        style={{ accentColor: 'var(--primary)', width: '14px', height: '14px', cursor: 'pointer' }}
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>

              <div className={styles.actions} style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <Button type="button" variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
                <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save Profile"}</Button>
              </div>
            </form>
          </GlassCard>
        </div>
      )}
    </motion.div>
  );
}
