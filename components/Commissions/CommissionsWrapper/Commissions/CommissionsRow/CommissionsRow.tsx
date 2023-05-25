import React from "react";
import { CommissionInfo } from "../../../../../lib/types";

interface CommissionRowProps {
  commissionData: CommissionInfo;
}

export const CommissionsRow = ({ commissionData }: CommissionRowProps) => {
  return <div>{commissionData.id}</div>;
};
