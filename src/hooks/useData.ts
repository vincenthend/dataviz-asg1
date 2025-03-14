import Papa from 'papaparse';
import _data from '../data/data.csv?raw';
import { useState } from 'react';
import { DataType } from '../types';

export function useData() {
  const [data] = useState<DataType[]>(() => {
    const data = Papa.parse(_data, { header: true })?.data as Record<
      string,
      string
    >[];
    return data.map((x: Record<string, string>) => ({
      ...x,
      no_of_drug_abusers: Number(x['no_of_drug_abusers']),
    })) as DataType[];
  });
  return data;
}
