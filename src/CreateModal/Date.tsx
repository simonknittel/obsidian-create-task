import clsx from "clsx";
import { CalendarDays } from "lucide-react";
import {
  ChangeEventHandler,
  FocusEventHandler,
  KeyboardEvent,
  MouseEvent,
  RefObject,
  useId,
  useRef,
  useState,
} from "react";
import { useFormContext } from "react-hook-form";
import { Inputs } from "./ReactApp";

type Props = Readonly<{
  nextFocusRef: RefObject<HTMLElement>;
}>;

export const Date = ({ nextFocusRef }: Props) => {
  const id = useId();
  const { register, setValue } = useFormContext<Inputs>();
  const [suggestionsVisible, setSuggestionsVisible] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const todayRef = useRef<HTMLButtonElement>(null);
  const tomorrowRef = useRef<HTMLButtonElement>(null);
  const nextSaturdayRef = useRef<HTMLButtonElement>(null);
  const nextMondayRef = useRef<HTMLButtonElement>(null);
  const datePickerRef = useRef<HTMLInputElement>(null);

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case "ArrowDown":
        todayRef.current?.focus();
        break;

      default:
        break;
    }
  };

  const handleInputBlur: FocusEventHandler<HTMLInputElement> = (event) => {
    if (
      [todayRef, tomorrowRef, nextSaturdayRef, nextMondayRef].find(
        (ref) => ref.current === event.relatedTarget,
      )
    )
      return;

    register("dueDate").onBlur(event);
    setSuggestionsVisible(false);
  };

  const handleSuggestionKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    prev: RefObject<HTMLInputElement | HTMLButtonElement> | null,
    next: RefObject<HTMLInputElement | HTMLButtonElement> | null,
  ) => {
    switch (event.key) {
      case "ArrowDown":
        next?.current?.focus();
        break;
      case "ArrowUp":
        prev?.current?.focus();
        break;
      case "Tab":
        setSuggestionsVisible(false);
        break;

      default:
        break;
    }
  };

  const handleSuggestionClick = (
    event: MouseEvent<HTMLButtonElement>,
    value: string,
  ) => {
    event.preventDefault();
    setValue("dueDate", value);
    setSuggestionsVisible(false);
    nextFocusRef.current?.focus();
  };

  const handleDatePickerChange: ChangeEventHandler<HTMLInputElement> = (
    event,
  ) => {
    const date = event.target.valueAsDate?.toISOString().split("T")[0];
    if (date) {
      setValue("dueDate", date);
    } else {
      setValue("dueDate", "");
    }
  };

  return (
    <div className="create-task__create-modal-row">
      <div className="create-task__create-modal-left">
        <div className="create-task__create-modal-icon">📅</div>

        <div>
          <label htmlFor={id}>Due date</label>

          <p className="create-task__info">
            Optional. You can use natural language like "next week"
          </p>
        </div>
      </div>

      <div className="create-task__create-modal-right">
        <div className="create-task__create-modal-input-row">
          <div className="create-task__create-modal-suggestions-anchor">
            <input
              type="text"
              onChange={register("dueDate").onChange}
              onBlur={handleInputBlur}
              ref={(ref) => {
                inputRef.current = ref;
                register("dueDate").ref(ref);
              }}
              name={register("dueDate").name}
              pattern={register("dueDate").pattern}
              required={register("dueDate").required}
              disabled={register("dueDate").disabled}
              id={id}
              onFocus={() => setSuggestionsVisible(true)}
              onKeyDown={(e) => handleInputKeyDown(e)}
              className="create-task__create-modal-date-input"
            />

            <ul
              className={clsx("create-task__create-modal-suggestions", {
                "create-task__create-modal-suggestions--visible":
                  suggestionsVisible,
              })}
            >
              <li>
                <button
                  type="button"
                  onClick={(e) => handleSuggestionClick(e, "Today")}
                  tabIndex={-1}
                  ref={todayRef}
                  onKeyDown={(e) =>
                    handleSuggestionKeyDown(e, inputRef, tomorrowRef)
                  }
                >
                  Today
                </button>
              </li>

              <li>
                <button
                  type="button"
                  onClick={(e) => handleSuggestionClick(e, "Tomorrow")}
                  tabIndex={-1}
                  ref={tomorrowRef}
                  onKeyDown={(e) =>
                    handleSuggestionKeyDown(e, todayRef, nextSaturdayRef)
                  }
                >
                  Tomorrow
                </button>
              </li>

              <li>
                <button
                  type="button"
                  onClick={(e) => handleSuggestionClick(e, "Next Saturday")}
                  tabIndex={-1}
                  ref={nextSaturdayRef}
                  onKeyDown={(e) =>
                    handleSuggestionKeyDown(e, tomorrowRef, nextMondayRef)
                  }
                >
                  Next Saturday
                </button>
              </li>

              <li>
                <button
                  type="button"
                  onClick={(e) => handleSuggestionClick(e, "Next Monday")}
                  tabIndex={-1}
                  ref={nextMondayRef}
                  onKeyDown={(e) =>
                    handleSuggestionKeyDown(e, nextSaturdayRef, null)
                  }
                >
                  Next Monday
                </button>
              </li>
            </ul>
          </div>

          <div className="create-task__create-modal-date-picker">
            <button
              type="button"
              onClick={() => datePickerRef.current?.showPicker()}
              className="create-task__create-modal-date-picker-button"
              tabIndex={-1}
            >
              <CalendarDays className="svg-icon" />
            </button>
            <input
              type="date"
              onChange={handleDatePickerChange}
              ref={datePickerRef}
              className="create-task__create-modal-date-picker-input"
              tabIndex={-1}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
