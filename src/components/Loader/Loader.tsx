import { PulseLoader } from "react-spinners";
import css from "./loader.module.css";
import type { FC } from "react";

const Loader: FC = () => {
  return (
    <div className={css.loaderContainer}>
      <PulseLoader
        color="#66e665"
        size={12}
        loading={true}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
};

export default Loader;
