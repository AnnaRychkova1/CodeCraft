// import { MdFilterList, MdLooksOne, MdLooksTwo, MdLooks3 } from "react-icons/md";
// import { SiJavascript, SiPython } from "react-icons/si";
// import { FaJava, FaBookOpen } from "react-icons/fa";
// import { GiHammerBreak } from "react-icons/gi";
// import type { Level, Language, TaskType } from "@/types/types";

// import css from "./filtering.module.css";

// // interface FilteringProps {
// //   level: string[];
// //   setLevel: (value: string[]) => void;
// //   language: string[];
// //   setLanguage: (value: string[]) => void;
// //   type: string[];
// //   setType: (value: string[]) => void;
// //   onResetFilters: () => void;
// // }
// interface FilteringProps {
//   level: Level[];
//   setLevel: (val: Level[]) => void;
//   language: Language[];
//   setLanguage: (val: Language[]) => void;
//   type: TaskType[];
//   setType: (val: TaskType[]) => void;
//   onResetFilters: () => void;
// }

// const toggleValue = <T extends string>(
//   value: T,
//   list: T[],
//   setList: (val: T[]) => void
// ) => {
//   if (list.includes(value)) {
//     setList(list.filter((v) => v !== value));
//   } else {
//     setList([...list, value]);
//   }
// };

// export default function Filtering({
//   level,
//   setLevel,
//   language,
//   setLanguage,
//   type,
//   setType,
//   onResetFilters,
// }: FilteringProps) {
//   return (
//     <div className={css.filteringContainer}>
//       <div className={css.topbox}>
//         <div className={css.titleBox}>
//           <MdFilterList className={css.icon} />
//           <h3 className={css.title}>Filters</h3>
//         </div>
//         <button
//           type="button"
//           onClick={onResetFilters}
//           className={css.clearBtn}
//           disabled={
//             level.length === 0 && language.length === 0 && type.length === 0
//           }
//         >
//           Clear filters
//         </button>
//       </div>
//       <div className={css.container}>
//         <div className={css.filterContainer}>
//           <label>Level</label>
//           <div className={css.optionGroup}>
//             {[
//               {
//                 value: "beginner",
//                 label: "Beginner",
//                 icon: <MdLooksOne className={css.levelBeginner} />,
//               },
//               {
//                 value: "intermediate",
//                 label: "Intermediate",
//                 icon: <MdLooksTwo className={css.levelIntermediate} />,
//               },
//               {
//                 value: "advanced",
//                 label: "Advanced",
//                 icon: <MdLooks3 className={css.levelAdvanced} />,
//               },
//             ].map(({ value, label, icon }) => (
//               <div key={value} className={css.optionBox}>
//                 <button
//                   type="button"
//                   aria-label={`${label} filter`}
//                   className={`${css.optionBtn} ${
//                     level.includes(value) ? css.active : ""
//                   }`}
//                   onClick={() => toggleValue(value, level, setLevel)}
//                 >
//                   {level.includes(value) && (
//                     <span className={css.checkmark}>✔</span>
//                   )}
//                 </button>
//                 <span className={css.filterDescr}>
//                   {icon}
//                   {label}
//                 </span>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className={css.filterContainer}>
//           <label>Language</label>
//           <div className={css.optionGroup}>
//             {[
//               {
//                 value: "python",
//                 label: "Python",
//                 icon: <SiPython className={css.languagePython} />,
//               },
//               {
//                 value: "java",
//                 label: "Java",
//                 icon: <FaJava className={css.languageJava} />,
//               },
//               {
//                 value: "javascript",
//                 label: "JavaScript",
//                 icon: <SiJavascript className={css.languageJavascript} />,
//               },
//             ].map(({ value, label, icon }) => (
//               <div key={value} className={css.optionBox}>
//                 <button
//                   key={value}
//                   type="button"
//                   aria-label={`${label} filter`}
//                   className={`${css.optionBtn} ${
//                     language.includes(value) ? css.active : ""
//                   }`}
//                   onClick={() => toggleValue(value, language, setLanguage)}
//                 >
//                   {language.includes(value) && (
//                     <span className={css.checkmark}>✔</span>
//                   )}
//                 </button>
//                 <span className={css.filterDescr}>
//                   {icon}
//                   {label}
//                 </span>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className={css.filterContainer}>
//           <label>Type</label>
//           <div className={css.optionGroup}>
//             {[
//               {
//                 value: "theory",
//                 label: "Theory",
//                 icon: <FaBookOpen className={css.typeTheory} />,
//               },
//               {
//                 value: "practice",
//                 label: "Practice",
//                 icon: <GiHammerBreak className={css.typePractice} />,
//               },
//             ].map(({ value, label, icon }) => (
//               <div key={value} className={css.optionBox}>
//                 <button
//                   key={value}
//                   type="button"
//                   aria-label={`${label} filter`}
//                   className={`${css.optionBtn} ${
//                     type.includes(value) ? css.active : ""
//                   }`}
//                   onClick={() => toggleValue(value, type, setType)}
//                 >
//                   {type.includes(value) && (
//                     <span className={css.checkmark}>✔</span>
//                   )}
//                 </button>
//                 <span className={css.filterDescr}>
//                   {icon}
//                   {label}
//                 </span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import { MdFilterList, MdLooksOne, MdLooksTwo, MdLooks3 } from "react-icons/md";
import { SiJavascript, SiPython } from "react-icons/si";
import { FaJava, FaBookOpen } from "react-icons/fa";
import { GiHammerBreak } from "react-icons/gi";
import type { Level, Language, TaskType } from "@/types/types";

import css from "./filtering.module.css";

interface FilteringProps {
  level: Level[];
  setLevel: (val: Level[]) => void;
  language: Language[];
  setLanguage: (val: Language[]) => void;
  type: TaskType[];
  setType: (val: TaskType[]) => void;
  onResetFilters: () => void;
}

const toggleValue = <T extends string>(
  value: T,
  list: T[],
  setList: (val: T[]) => void
) => {
  if (list.includes(value)) {
    setList(list.filter((v) => v !== value));
  } else {
    setList([...list, value]);
  }
};

const levels = [
  {
    value: "beginner",
    label: "Beginner",
    icon: <MdLooksOne className={css.levelBeginner} />,
  },
  {
    value: "intermediate",
    label: "Intermediate",
    icon: <MdLooksTwo className={css.levelIntermediate} />,
  },
  {
    value: "advanced",
    label: "Advanced",
    icon: <MdLooks3 className={css.levelAdvanced} />,
  },
] as const;

const languages = [
  {
    value: "python",
    label: "Python",
    icon: <SiPython className={css.languagePython} />,
  },
  {
    value: "java",
    label: "Java",
    icon: <FaJava className={css.languageJava} />,
  },
  {
    value: "javascript",
    label: "JavaScript",
    icon: <SiJavascript className={css.languageJavascript} />,
  },
] as const;

const types = [
  {
    value: "theory",
    label: "Theory",
    icon: <FaBookOpen className={css.typeTheory} />,
  },
  {
    value: "practice",
    label: "Practice",
    icon: <GiHammerBreak className={css.typePractice} />,
  },
] as const;

export default function Filtering({
  level,
  setLevel,
  language,
  setLanguage,
  type,
  setType,
  onResetFilters,
}: FilteringProps) {
  return (
    <div className={css.filteringContainer}>
      <div className={css.topbox}>
        <div className={css.titleBox}>
          <MdFilterList className={css.icon} />
          <h3 className={css.title}>Filters</h3>
        </div>
        <button
          type="button"
          onClick={onResetFilters}
          className={css.clearBtn}
          disabled={
            level.length === 0 && language.length === 0 && type.length === 0
          }
        >
          Clear filters
        </button>
      </div>

      <div className={css.container}>
        {/* Level Filter */}
        <div className={css.filterContainer}>
          <label>Level</label>
          <div className={css.optionGroup}>
            {levels.map(({ value, label, icon }) => (
              <div key={value} className={css.optionBox}>
                <button
                  type="button"
                  aria-label={`${label} filter`}
                  className={`${css.optionBtn} ${
                    level.includes(value) ? css.active : ""
                  }`}
                  onClick={() => toggleValue<Level>(value, level, setLevel)}
                >
                  {level.includes(value) && (
                    <span className={css.checkmark}>✔</span>
                  )}
                </button>
                <span className={css.filterDescr}>
                  {icon}
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Language Filter */}
        <div className={css.filterContainer}>
          <label>Language</label>
          <div className={css.optionGroup}>
            {languages.map(({ value, label, icon }) => (
              <div key={value} className={css.optionBox}>
                <button
                  type="button"
                  aria-label={`${label} filter`}
                  className={`${css.optionBtn} ${
                    language.includes(value) ? css.active : ""
                  }`}
                  onClick={() =>
                    toggleValue<Language>(value, language, setLanguage)
                  }
                >
                  {language.includes(value) && (
                    <span className={css.checkmark}>✔</span>
                  )}
                </button>
                <span className={css.filterDescr}>
                  {icon}
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Type Filter */}
        <div className={css.filterContainer}>
          <label>Type</label>
          <div className={css.optionGroup}>
            {types.map(({ value, label, icon }) => (
              <div key={value} className={css.optionBox}>
                <button
                  type="button"
                  aria-label={`${label} filter`}
                  className={`${css.optionBtn} ${
                    type.includes(value) ? css.active : ""
                  }`}
                  onClick={() => toggleValue<TaskType>(value, type, setType)}
                >
                  {type.includes(value) && (
                    <span className={css.checkmark}>✔</span>
                  )}
                </button>
                <span className={css.filterDescr}>
                  {icon}
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
