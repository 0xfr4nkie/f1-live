import React from "react";

export function Dropdown(props: {
  value: string | number | undefined,
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void,
  options: string[] | number[],
}) {
  return (
    <div>
      <label>Select Event: </label>
      <select id={"event-selector"} value={props.value} onChange={props.onChange}>
        {props.options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  )
}