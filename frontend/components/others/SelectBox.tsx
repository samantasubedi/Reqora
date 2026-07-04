"use client";
import React, { useState } from "react";
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
  label,
  value,
  onChange,
  options,
}: {
  label:string,
  value: string;
  onChange: (val: string) => void;
  options: statusOptionsType;
}) => {
  return (
    <Combobox
      onValueChange={(v) => {
        onChange(String(v));
      }}
      items={options}
      value={value}
    >
      <ComboboxInput
        placeholder={`select a ${label}`}
        className="h-11 rounded-lg border-slate-200 bg-white focus:ring-2 focus:ring-violet-400 focus:border-transparent transition"
      ></ComboboxInput>
      <ComboboxContent>
        <ComboboxEmpty>{label=="status"?"No such status":label=="type"?"No such type":label=="department"?"No such department":""}</ComboboxEmpty>
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
