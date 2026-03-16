import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/Button";

export default function NewTripButton() {
  const navigate = useNavigate();

  return (
    <Button
      variant="primary"
      className="w-full justify-center"
      onClick={() => navigate("/app/new")}
    >
      New Trip
    </Button>
  );
}

