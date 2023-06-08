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
  Checkbox,
  Flex,
  Textarea,
} from "@chakra-ui/react";
import { mapAxiosErrorToLabel } from "../../../lib/server/BackendError/BackendError";
import React, { useEffect, useState } from "react";
import { useContent } from "../../../lib/hooks/useContent";

import { usePostEvent } from "../../../lib/api/hooks/events";
import { EVENT_VISIBILITY } from "../../../lib/types";
import moment from "moment";
import styles from "./EventAddModal.module.scss";

interface EventAddModalProps {
  onClose: () => void;
  isOpen: boolean;
  initialDates: {
    start: Date | null;
    end: Date | null;
  };
}

interface EventData {
  title: string;
  description: string;
  startDate: Date | null;
  endDate: Date | null;
  visibility: EVENT_VISIBILITY;
  orderId?: number;
}

const initialEventData: EventData = {
  title: "",
  description: "",
  startDate: new Date(Date.now()),
  endDate: new Date(Date.now()),
  visibility: EVENT_VISIBILITY.PUBLIC,
  orderId: undefined,
} as const;

export const EventAddModal = ({
  onClose,
  isOpen,
  initialDates,
}: EventAddModalProps) => {
  const { t } = useContent();

  const [eventData, setEventData] = useState<EventData>({
    ...initialEventData,
    startDate: initialDates.start,
    endDate: initialDates.end,
  });

  const {
    mutate: postEvent,
    error,
    isSuccess,
    isLoading,
  } = usePostEvent(onClose);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { startDate, endDate, ...data } = eventData;

    const newEventData = {
      ...data,
      //inputs are marked as required, so we can safely assume that they are not null
      startDate: startDate!.toISOString(),
      endDate: endDate!.toISOString(),
    };

    postEvent(newEventData);
  };

  useEffect(() => {
    if (isSuccess) {
      onClose();
    }
  }, [isSuccess, onClose]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setEventData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePrivacyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target;
    setEventData((prev) => ({
      ...prev,
      visibility: checked ? EVENT_VISIBILITY.PRIVATE : EVENT_VISIBILITY.PUBLIC,
    }));
  };

  const [formattedStartDate, formattedEndDate] = [
    eventData.startDate,
    eventData.endDate,
  ].map((date) => (date ? moment(date).format("YYYY-MM-DD HH:mm") : ""));

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit}>
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
              required
              className={styles.modalInput}
              id="add-event-modal-title"
              name="title"
              value={String(eventData.title)}
              onChange={handleChange}
            />
            <label htmlFor="add-event-modal-description">
              {t("pages.schedule.modals.event_add.description")}
            </label>
            <Textarea
              className={styles.modalInput}
              id="add-event-modal-description"
              name="description"
              value={String(eventData.description)}
              onChange={handleChange}
              rows={7}
              resize={"none"}
            />
            <label
              id="add-event-modal-startDate"
              htmlFor="add-event-modal-startDate"
            >
              {t("pages.schedule.modals.event_add.startDate")}
            </label>
            <Input
              required
              className={styles.modalInput}
              id="add-event-modal-startDate"
              type="datetime-local"
              value={formattedStartDate}
              name="startDate"
              onChange={handleChange}
            />
            <label
              id="add-event-modal-endDate"
              htmlFor="add-event-modal-endDate"
            >
              {t("pages.schedule.modals.event_add.endDate")}
            </label>
            <Input
              required
              className={styles.modalInput}
              id="add-event-modal-endDate"
              type="datetime-local"
              value={formattedEndDate}
              name="endDate"
              onChange={handleChange}
            />

            <Flex alignItems="center" mb={2}>
              <Checkbox
                id="add-event-modal-visibility"
                type="checkbox"
                checked={eventData.visibility === EVENT_VISIBILITY.PRIVATE}
                name="visibility"
                onChange={handlePrivacyChange}
              />
              <label
                className={styles.checkboxLabel}
                id="add-event-modal-visibility"
                htmlFor="add-event-modal-visibility"
              >
                {t("pages.schedule.modals.event_add.isPrivate")}
              </label>
            </Flex>
            {!!error && (
              <Text color="red">
                {t(`errors.backendErrorLabel.${mapAxiosErrorToLabel(error)}`)}
              </Text>
            )}
          </ModalBody>
          <ModalFooter alignItems="flex-end">
            <Button
              type="submit"
              colorScheme="green"
              isLoading={isLoading}
              mr={3}
            >
              {t("buttons.add")}
            </Button>
            <Button colorScheme="red" onClick={onClose}>
              {t("buttons.cancel")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
};
