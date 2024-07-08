import PageNav from "../components/navigationComponents/PageNav";
import styles from "./Product.module.css";

export default function Product() {
  return (
    <main className={styles.product}>
      <PageNav />
      <section>
        <img
          src="img-1.jpg"
          alt="person with dog overlooking mountain with sunset"
        />
        <div>
          <h2>About WorldWide.</h2>
          <p>
            WorldWise is web application that allows you to explore cities and
            mark the ones you have visited. You can also explore countries and
            add cities to your list. Enjoy your journey!
          </p>
        </div>
      </section>
    </main>
  );
}
