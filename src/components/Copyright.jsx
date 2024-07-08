import styles from "./Copyright.module.css";

function Copyright() {
  return (
    <footer className={styles.footer}>
      <p className={styles.copyright}>
        &copy; copyright{new Date().getFullYear()} by Moahmed Mouloudj
      </p>
    </footer>
  );
}

export default Copyright;
