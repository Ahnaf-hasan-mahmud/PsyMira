import Logo from "@/components/ui/Logo";
import styles from "./Footer.module.css";

const COLUMNS = [
  {
    title: "Explore",
    links: ["Features", "Stories", "Dashboard", "Journal"],
  },
  {
    title: "Company",
    links: ["About", "Our Mission", "Careers", "Press"],
  },
  {
    title: "Support",
    links: ["Help Center", "Privacy", "Terms", "Contact"],
  },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.top}>
          <div className={styles.brand}>
            <Logo />
            <p className={styles.tagline}>
              A calming digital sanctuary where you understand yourself, one
              story at a time.
            </p>
          </div>

          <div className={styles.cols}>
            {COLUMNS.map((col) => (
              <div key={col.title} className={styles.col}>
                <h4 className={styles.colTitle}>{col.title}</h4>
                <ul>
                  {col.links.map((l) => (
                    <li key={l}>
                      <a href="#" className={styles.link}>
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.bottom}>
          <span>© {new Date().getFullYear()} PsyMira. Made with care.</span>
          <span className={styles.made}>
            Designed for quiet minds everywhere.
          </span>
        </div>
      </div>
    </footer>
  );
}
