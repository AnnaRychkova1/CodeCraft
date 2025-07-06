import { PulseLoader } from "react-spinners";
import type { FC } from "react";
import css from "./loader.module.css";

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
