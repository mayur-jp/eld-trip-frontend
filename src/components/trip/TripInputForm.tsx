import { useCallback, useState } from "react";

import type { Location } from "@/types/common";
import type { TripInput } from "@/types/trip";
import { useTrip } from "@/hooks/useTrip";
import { useNavigate } from "react-router-dom";
import {
  BUTTON_PRIMARY,
  CARD_PADDED,
  CARD_HEADER,
  DIVIDER,
  INPUT_BASE,
  LABEL,
  MAIN_CONTENT,
} from "@/lib/styles";
import { LocationAutocomplete } from "@/components/trip/LocationAutocomplete";
import { Alert } from "@/components/ui/Alert";
import { Spinner } from "@/components/ui/Spinner";

export function TripInputForm() {
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [pickupLocation, setPickupLocation] = useState<Location | null>(null);
  const [dropoffLocation, setDropoffLocation] = useState<Location | null>(null);
  const [currentCycleHoursUsed, setCurrentCycleHoursUsed] = useState<number>(0);
  const [carrierName, setCarrierName] = useState<string>("");
  const [officeAddress, setOfficeAddress] = useState<string>("");
  const [driverName, setDriverName] = useState<string>("");
  const [coDriver, setCoDriver] = useState<string>("");
  const [truckNumber, setTruckNumber] = useState<string>("");
  const [trailerNumber, setTrailerNumber] = useState<string>("");
  const [formError, setFormError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { submitTrip, isLoading, error, clearError } = useTrip();

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setFormError(null);
      clearError();

      if (!currentLocation || !pickupLocation || !dropoffLocation) {
        setFormError("Current, pickup, and dropoff locations are all required.");
        return;
      }

      if (
        Number.isNaN(currentCycleHoursUsed) ||
        currentCycleHoursUsed < 0 ||
        currentCycleHoursUsed > 70
      ) {
        setFormError("Current cycle hours used must be between 0 and 70.");
        return;
      }

      const trimmedCarrierName = carrierName.trim();
      const trimmedOfficeAddress = officeAddress.trim();
      const trimmedDriverName = driverName.trim();
      const trimmedTruckNumber = truckNumber.trim();

      if (!trimmedCarrierName) {
        setFormError("Carrier name is required.");
        return;
      }

      if (!trimmedOfficeAddress) {
        setFormError("Office address is required.");
        return;
      }

      if (!trimmedDriverName) {
        setFormError("Driver name is required.");
        return;
      }

      if (!trimmedTruckNumber) {
        setFormError("Truck number is required.");
        return;
      }

      const input: TripInput = {
        currentLocation,
        pickupLocation,
        dropoffLocation,
        currentCycleHoursUsed,
        carrierName: trimmedCarrierName,
        officeAddress: trimmedOfficeAddress,
        driverName: trimmedDriverName,
        coDriver: coDriver.trim() || undefined,
        truckNumber: trimmedTruckNumber,
        trailerNumber: trailerNumber.trim() || undefined,
      };

      try {
        const result = await submitTrip(input);
        navigate(`/app/trips/${result.id}`);
      } catch {
        // Error state is handled via `error` from useTrip.
      }
    },
    [
      carrierName,
      clearError,
      coDriver,
      currentCycleHoursUsed,
      currentLocation,
      driverName,
      dropoffLocation,
      navigate,
      officeAddress,
      pickupLocation,
      submitTrip,
      trailerNumber,
      truckNumber,
    ],
  );

  const isSubmitDisabled =
    isLoading ||
    currentLocation === null ||
    pickupLocation === null ||
    dropoffLocation === null;

  return (
    <div className={MAIN_CONTENT}>
      <div className={`${CARD_PADDED} max-w-[640px] mx-auto`}>
        <h1 className={CARD_HEADER}>Plan Your Trip</h1>

        {(formError || error) && (
          <div className="mb-4">
            <Alert variant="error">
              <p className="text-sm">
                {formError ?? error}
              </p>
            </Alert>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <LocationAutocomplete
            label="Current Location"
            name="current_location"
            placeholder="Start typing a city or address"
            required
            onSelect={setCurrentLocation}
          />

          <LocationAutocomplete
            label="Pickup Location"
            name="pickup_location"
            placeholder="Start typing a city or address"
            required
            onSelect={setPickupLocation}
          />

          <LocationAutocomplete
            label="Dropoff Location"
            name="dropoff_location"
            placeholder="Start typing a city or address"
            required
            onSelect={setDropoffLocation}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="cycle-hours" className={LABEL}>
                Current Cycle Hours Used <span className="text-red-500">*</span>
              </label>
              <input
                id="cycle-hours"
                type="number"
                min={0}
                max={70}
                step={0.5}
                className={INPUT_BASE}
                value={Number.isNaN(currentCycleHoursUsed) ? "" : currentCycleHoursUsed}
                onChange={(event) => {
                  const value = event.target.value;
                  const parsed = value === "" ? 0 : Number.parseFloat(value);
                  setCurrentCycleHoursUsed(Number.isNaN(parsed) ? 0 : parsed);
                }}
              />
              <div className="mt-1.5">
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                  <span>{currentCycleHoursUsed} / 70 hours used</span>
                  <span>{Math.max(0, 70 - currentCycleHoursUsed)} remaining</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-200">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      currentCycleHoursUsed >= 60
                        ? "bg-red-500"
                        : currentCycleHoursUsed >= 45
                          ? "bg-amber-500"
                          : "bg-emerald-500"
                    }`}
                    style={{ width: `${Math.min(100, (currentCycleHoursUsed / 70) * 100)}%` }}
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="carrier-name" className={LABEL}>
                Carrier Name <span className="text-red-500">*</span>
              </label>
              <input
                id="carrier-name"
                type="text"
                className={INPUT_BASE}
                value={carrierName}
                onChange={(event) => setCarrierName(event.target.value)}
              />
            </div>
          </div>

          <div>
            <label htmlFor="office-address" className={LABEL}>
              Office Address <span className="text-red-500">*</span>
            </label>
            <input
              id="office-address"
              type="text"
              className={INPUT_BASE}
              value={officeAddress}
              onChange={(event) => setOfficeAddress(event.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="driver-name" className={LABEL}>
                Driver Name <span className="text-red-500">*</span>
              </label>
              <input
                id="driver-name"
                type="text"
                className={INPUT_BASE}
                value={driverName}
                onChange={(event) => setDriverName(event.target.value)}
              />
            </div>

            <div>
              <label htmlFor="co-driver" className={LABEL}>
                Co-Driver
              </label>
              <input
                id="co-driver"
                type="text"
                className={INPUT_BASE}
                value={coDriver}
                onChange={(event) => setCoDriver(event.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="truck-number" className={LABEL}>
                Truck #
                <span className="text-red-500"> *</span>
              </label>
              <input
                id="truck-number"
                type="text"
                className={INPUT_BASE}
                value={truckNumber}
                onChange={(event) => setTruckNumber(event.target.value)}
              />
            </div>

            <div>
              <label htmlFor="trailer-number" className={LABEL}>
                Trailer #
              </label>
              <input
                id="trailer-number"
                type="text"
                className={INPUT_BASE}
                value={trailerNumber}
                onChange={(event) => setTrailerNumber(event.target.value)}
              />
            </div>
          </div>

          <div className={DIVIDER} />

          <button
            type="submit"
            className={`${BUTTON_PRIMARY} w-full`}
            disabled={isSubmitDisabled}
          >
            {isLoading ? <Spinner size="sm" /> : "Plan My Trip"}
          </button>
        </form>
      </div>
    </div>
  );
}


