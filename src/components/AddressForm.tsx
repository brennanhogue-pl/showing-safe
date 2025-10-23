"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AddressFormProps {
  street: string;
  unit: string;
  city: string;
  state: string;
  zipCode: string;
  onStreetChange: (value: string) => void;
  onUnitChange: (value: string) => void;
  onCityChange: (value: string) => void;
  onStateChange: (value: string) => void;
  onZipCodeChange: (value: string) => void;
  disabled?: boolean;
}

const US_STATES = [
  { value: "AL", label: "Alabama" },
  { value: "AK", label: "Alaska" },
  { value: "AZ", label: "Arizona" },
  { value: "AR", label: "Arkansas" },
  { value: "CA", label: "California" },
  { value: "CO", label: "Colorado" },
  { value: "CT", label: "Connecticut" },
  { value: "DE", label: "Delaware" },
  { value: "FL", label: "Florida" },
  { value: "GA", label: "Georgia" },
  { value: "HI", label: "Hawaii" },
  { value: "ID", label: "Idaho" },
  { value: "IL", label: "Illinois" },
  { value: "IN", label: "Indiana" },
  { value: "IA", label: "Iowa" },
  { value: "KS", label: "Kansas" },
  { value: "KY", label: "Kentucky" },
  { value: "LA", label: "Louisiana" },
  { value: "ME", label: "Maine" },
  { value: "MD", label: "Maryland" },
  { value: "MA", label: "Massachusetts" },
  { value: "MI", label: "Michigan" },
  { value: "MN", label: "Minnesota" },
  { value: "MS", label: "Mississippi" },
  { value: "MO", label: "Missouri" },
  { value: "MT", label: "Montana" },
  { value: "NE", label: "Nebraska" },
  { value: "NV", label: "Nevada" },
  { value: "NH", label: "New Hampshire" },
  { value: "NJ", label: "New Jersey" },
  { value: "NM", label: "New Mexico" },
  { value: "NY", label: "New York" },
  { value: "NC", label: "North Carolina" },
  { value: "ND", label: "North Dakota" },
  { value: "OH", label: "Ohio" },
  { value: "OK", label: "Oklahoma" },
  { value: "OR", label: "Oregon" },
  { value: "PA", label: "Pennsylvania" },
  { value: "RI", label: "Rhode Island" },
  { value: "SC", label: "South Carolina" },
  { value: "SD", label: "South Dakota" },
  { value: "TN", label: "Tennessee" },
  { value: "TX", label: "Texas" },
  { value: "UT", label: "Utah" },
  { value: "VT", label: "Vermont" },
  { value: "VA", label: "Virginia" },
  { value: "WA", label: "Washington" },
  { value: "WV", label: "West Virginia" },
  { value: "WI", label: "Wisconsin" },
  { value: "WY", label: "Wyoming" },
];

export default function AddressForm({
  street,
  unit,
  city,
  state,
  zipCode,
  onStreetChange,
  onUnitChange,
  onCityChange,
  onStateChange,
  onZipCodeChange,
  disabled = false,
}: AddressFormProps) {
  return (
    <div className="space-y-4">
      {/* Street Address */}
      <div className="space-y-2">
        <Label htmlFor="street">Street Address</Label>
        <Input
          id="street"
          type="text"
          placeholder="123 Main Street"
          value={street}
          onChange={(e) => onStreetChange(e.target.value)}
          disabled={disabled}
          required
        />
      </div>

      {/* Unit/Suite Number (Optional) */}
      <div className="space-y-2">
        <Label htmlFor="unit">
          Unit, Suite, or Apt # <span className="text-muted-foreground">(Optional)</span>
        </Label>
        <Input
          id="unit"
          type="text"
          placeholder="Apt 2B, Suite 100, Unit 5, etc."
          value={unit}
          onChange={(e) => onUnitChange(e.target.value)}
          disabled={disabled}
        />
      </div>

      {/* City */}
      <div className="space-y-2">
        <Label htmlFor="city">City</Label>
        <Input
          id="city"
          type="text"
          placeholder="Salt Lake City"
          value={city}
          onChange={(e) => onCityChange(e.target.value)}
          disabled={disabled}
          required
        />
      </div>

      {/* State and Zip Code - Side by side */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="state">State</Label>
          <Select value={state} onValueChange={onStateChange} disabled={disabled}>
            <SelectTrigger id="state">
              <SelectValue placeholder="Select state" />
            </SelectTrigger>
            <SelectContent>
              {US_STATES.map((usState) => (
                <SelectItem key={usState.value} value={usState.value}>
                  {usState.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="zipCode">Zip Code</Label>
          <Input
            id="zipCode"
            type="text"
            placeholder="84101"
            value={zipCode}
            onChange={(e) => onZipCodeChange(e.target.value)}
            disabled={disabled}
            required
            maxLength={5}
            pattern="[0-9]{5}"
          />
        </div>
      </div>
    </div>
  );
}
