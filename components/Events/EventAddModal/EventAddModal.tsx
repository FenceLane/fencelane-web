import {
  Modal,
  ModalContent,
  Input,
  ModalOverlay,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Text,
  Button,
  ModalFooter,
} from "@chakra-ui/react";
import { mapAxiosErrorToLabel } from "../../../lib/server/BackendError/BackendError";
import React, { useState } from "react";
import { useContent } from "../../../lib/hooks/useContent";

import { EventDataCreate } from "../../../lib/schema/eventData";
import { usePostEvent } from "../../../lib/api/hooks/events";
import { EVENT_VISIBILITY } from "../../../lib/types";

interface ProductAddModalProps {
  onClose: () => void;
  isOpen: boolean;
}

const initialEventData: EventDataCreate = {
  title: "",
  description: "",
  startDate: "",
  endDate: "",
  visibility: EVENT_VISIBILITY.PUBLIC,
  orderId: undefined,
} as const;

export const EventAddModal = ({ onClose, isOpen }: ProductAddModalProps) => {
  const { t } = useContent();

  const [eventData, setEventData] = useState<EventDataCreate>(initialEventData);

  const {
    mutate: postEvent,
    error,
    isSuccess,
    isLoading,
  } = usePostEvent(onClose);

  const handlePostEvent = () => {
    const { startDate, endDate, ...data } = eventData;
    const [startDateISO, endDateISO] = [startDate, endDate].map((date) =>
      new Date(date).toISOString()
    );

    const newEventData = {
      ...data,
      startDate: startDateISO,
      endDate: endDateISO,
    };

    console.log(newEventData);

    // postEvent(newEventData);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setEventData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleVariantChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setProductData((productData) => ({
      ...productData,
      variant: event.target.value as PRODUCT_VARIANT,
    }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {t("pages.schedule.modals.event_add.heading")}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <label htmlFor="add-event-modal-title">
            {t("pages.schedule.modals.event_add.title")}
          </label>
          <Input
            id="add-event-modal-title"
            name="title"
            value={String(eventData.title)}
            onChange={handleChange}
          />
          <label htmlFor="add-event-modal-description">
            {t("pages.schedule.modals.event_add.description")}
          </label>
          <Input
            id="add-event-modal-description"
            name="description"
            value={String(eventData.description)}
            onChange={handleChange}
          />
          <label
            id="add-event-modal-startDate"
            htmlFor="add-event-modal-startDate"
          >
            {t("pages.schedule.modals.event_add.startDate")}
          </label>
          <Input
            id="add-event-modal-startDate"
            type="datetime-local"
            value={eventData.startDate}
            name="startDate"
            onChange={handleChange}
          />
          <label id="add-event-modal-endDate" htmlFor="add-event-modal-endDate">
            {t("pages.schedule.modals.event_add.endDate")}
          </label>
          <Input
            id="add-event-modal-endDate"
            type="datetime-local"
            value={eventData.endDate}
            name="endDate"
            onChange={handleChange}
          />
          <label
            id="add-event-modal-visibility"
            htmlFor="add-event-modal-visibility"
          >
            {t("pages.schedule.modals.event_add.visibility")}
          </label>
          <Input
            id="add-event-modal-visibility"
            type="checkbox"
            checked={eventData.visibility === EVENT_VISIBILITY.PRIVATE}
            name="visibility"
            onChange={handleChange}
          />
          {!!error && (
            <Text color="red">
              {t(`errors.backendErrorLabel.${mapAxiosErrorToLabel(error)}`)}
            </Text>
          )}
        </ModalBody>
        <ModalFooter alignItems="flex-end">
          <Button
            colorScheme="green"
            isLoading={isLoading}
            onClick={handlePostEvent}
            mr={3}
          >
            {t("pages.storage.buttons.add")}
          </Button>
          <Button colorScheme="red" onClick={onClose}>
            {t("pages.storage.buttons.cancel")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
