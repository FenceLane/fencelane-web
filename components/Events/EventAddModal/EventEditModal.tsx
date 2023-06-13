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

import { usePostEvent, useUpdateEvent } from "../../../lib/api/hooks/events";
import { EVENT_VISIBILITY } from "../../../lib/types";
import moment from "moment";
import styles from "./EventEditModal.module.scss";

interface EventEditModalProps {
  onClose: () => void;
  isOpen: boolean;
  eventData: EventData;
}

interface EventData {
  id?: string;
  title: string;
  description: string;
  startDate: Date | null;
  endDate: Date | null;
  visibility: EVENT_VISIBILITY;
}

export const EventEditModal = ({
  onClose,
  isOpen,
  eventData,
}: EventEditModalProps) => {
  const { t } = useContent();

  const [localEventData, setLocalEventData] = useState<EventData>(eventData);

  const {
    mutate: postEvent,
    error: createError,
    isSuccess: isCreateSuccess,
    isLoading: isCreateLoading,
  } = usePostEvent(onClose);

  const {
    mutate: updateEvent,
    error: updateError,
    isSuccess: isUpdateSuccess,
    isLoading: isUpdateLoading,
  } = useUpdateEvent(onClose);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { startDate, endDate, ...data } = localEventData;

    const newEventData = {
      ...data,
      //inputs are marked as required, so we can safely assume that they are not null
      startDate: startDate!.toISOString(),
      endDate: endDate!.toISOString(),
    };

    localEventData.id
      ? updateEvent({ id: localEventData.id, data: newEventData })
      : postEvent(newEventData);
  };

  useEffect(() => {
    if (isUpdateSuccess || isCreateSuccess) {
      onClose();
    }
  }, [isUpdateSuccess, isCreateSuccess, onClose]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setLocalEventData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setLocalEventData((prev) => ({
      ...prev,
      [name]: new Date(value),
    }));
  };

  const handlePrivacyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target;
    setLocalEventData((prev) => ({
      ...prev,
      visibility: checked ? EVENT_VISIBILITY.PRIVATE : EVENT_VISIBILITY.PUBLIC,
    }));
  };

  const [formattedStartDate, formattedEndDate] = [
    localEventData.startDate,
    localEventData.endDate,
  ].map((date) => (date ? moment(date).format("YYYY-MM-DD HH:mm") : ""));

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {localEventData.id
              ? t("pages.schedule.modals.event_edit.heading")
              : t("pages.schedule.modals.event_add.heading")}
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
              value={String(localEventData.title)}
              onChange={handleChange}
            />
            <label htmlFor="add-event-modal-description">
              {t("pages.schedule.modals.event_add.description")}
            </label>
            <Textarea
              className={styles.modalInput}
              id="add-event-modal-description"
              name="description"
              value={String(localEventData.description)}
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
              onChange={handleDateChange}
            />

            <Flex alignItems="center" mb={2}>
              <Checkbox
                id="add-event-modal-visibility"
                type="checkbox"
                isChecked={
                  localEventData.visibility === EVENT_VISIBILITY.PRIVATE
                }
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
            {!!createError ||
              (!!updateError && (
                <Text color="red">
                  {t(
                    `errors.backendErrorLabel.${mapAxiosErrorToLabel(
                      createError || updateError
                    )}`
                  )}
                </Text>
              ))}
          </ModalBody>
          <ModalFooter alignItems="flex-end">
            <Button
              type="submit"
              colorScheme="green"
              isLoading={isUpdateLoading || isCreateLoading}
              mr={3}
            >
              {t("buttons.confirm")}
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
