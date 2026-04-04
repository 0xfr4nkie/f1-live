import React from "react";

export function Dropdown(props: {
  label: string,
  value: string | number | undefined,
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void,
  options: string[] | number[],
}) {
  const lastWord = props.label.toLowerCase().split(" ").pop() ?? ""
  const selectorId = `${lastWord}-selector`
  return (
    <div className="dropdown-container">
      <label htmlFor={selectorId} className="dropdown-label">{props.label}: </label>
      <select 
        id={selectorId} 
        className="dropdown-select"
        value={props.value ?? `Select a ${lastWord}`} 
        onChange={props.onChange}
      >
        {props.options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  )
}