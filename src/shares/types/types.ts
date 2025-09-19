export interface Ward {
  name: string;
  code: number;
}

export interface City {
  name: string;
  code: number;
  wards: Ward[];
}
