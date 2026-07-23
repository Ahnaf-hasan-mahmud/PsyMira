import Sidebar from "@/components/dashboard/Sidebar";
import styles from "../dashboard/layout.module.css";

export default function RelaxationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.shell}>
      <Sidebar />
      <div className={styles.main}>{children}</div>
    </div>
  );
}
