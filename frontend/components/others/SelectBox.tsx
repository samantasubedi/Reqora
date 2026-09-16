"use client";
import React from "react";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "../ui/combobox";
type statusOptionsType = { label: string; value: string }[];

const SelectBox = ({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  options: statusOptionsType;
}) => {
  const labelFor = (itemValue: unknown) => {
    if (itemValue && typeof itemValue === "object") {
      const item = itemValue as { label?: unknown; value?: unknown };
      return item.label != null
        ? String(item.label)
        : item.value != null
          ? String(item.value)
          : "";
    }
    const id = String(itemValue ?? "");
    return options.find((o) => o.value === id)?.label ?? id;
  };

  return (
    <Combobox
      onValueChange={(v) => {
        onChange(String(v));
      }}
      items={options}
      value={value}
      itemToStringLabel={labelFor}
    >
      <ComboboxInput
        placeholder={`select a ${label}`}
        className="h-11 rounded-lg border-slate-200 bg-white focus:ring-2 focus:ring-violet-400 focus:border-transparent transition"
      ></ComboboxInput>
      <ComboboxContent>
        <ComboboxEmpty>{label=="status"?"No such status":label=="type"?"No such type":label=="department"?"No such department":"No results"}</ComboboxEmpty>
        <ComboboxList className="text-gray-600">
          {(item) => {
            return (
              <ComboboxItem key={item.value} value={item.value}>
                {item.label}
              </ComboboxItem>
            );
          }}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
};

export default SelectBox;