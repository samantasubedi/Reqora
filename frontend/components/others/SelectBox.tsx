"use client"
import React from "react";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "../ui/combobox";
import { useForm } from "react-hook-form";
type statusOptionsType = { label: string; value: string }[];

const SelectBox = ({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (val: string) => void;
  options: statusOptionsType;
}) => {
  return (
    <Combobox
      onValueChange={(v) => {
        onChange(String(v));
      }}
      value={value}
      items={options}
    >
      <ComboboxInput
        placeholder="Select a status"
        className="h-11 rounded-lg border-slate-200 bg-white focus:ring-2 focus:ring-violet-400 focus:border-transparent transition"
      ></ComboboxInput>
      <ComboboxContent>
        <ComboboxEmpty>No such status</ComboboxEmpty>
        <ComboboxList className="text-gray-600">
          {(item) => {
            return (
              <ComboboxItem key={item.value} value={item.value} >
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
