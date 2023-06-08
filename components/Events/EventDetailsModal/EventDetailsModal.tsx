import {
  Modal,
  ModalContent,
  ModalOverlay,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Heading,
  Text,
  Button,
  ModalFooter,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";
import { useContent } from "../../../lib/hooks/useContent";

import { EVENT_VISIBILITY, EventInfo } from "../../../lib/types";
import { useDeleteEvent } from "../../../lib/api/hooks/events";
import { EventTimeRange } from "./EventTimeRange";
import { mapAxiosErrorToLabel } from "../../../lib/server/BackendError/BackendError";
import { EventEditModal } from "../EventAddModal/EventEditModal";

interface EventDetailsModalProps {
  onClose: () => void;
  eventData: EventInfo;
}

export const EventDetailsModal = ({
  onClose,
  eventData,
}: EventDetailsModalProps) => {
  const { t } = useContent();

  const {
    isLoading: isDeleteLoading,
    mutate: deleteEvent,
    isError: isDeleteError,
    error: deleteError,
  } = useDeleteEvent(onClose);

  const {
    isOpen: isEventEditOpen,
    onOpen: onEventEditOpen,
    onClose: onEventEditClose,
  } = useDisclosure();

  return (
    <>
      <Modal isOpen={true} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Text color="gray.600" fontSize="12px" fontWeight="400">
              {t("pages.schedule.modals.event_details.title")}:
            </Text>
            <Heading as="h3" size="md">
              {eventData.title}
            </Heading>
            <Heading
              mt="10px"
              as="h4"
              size="sm"
              fontWeight={400}
              fontSize="14px"
            >
              <Text color="gray.600" fontSize="12px" fontWeight="400">
                {t("pages.schedule.modals.event_details.date")}:
              </Text>
              <EventTimeRange event={eventData} />
            </Heading>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text color="gray.600" fontSize="12px" fontWeight="400" mt="10px">
              {t("pages.schedule.modals.event_details.description")}:
            </Text>
            <Text
              p="5px"
              borderBottom="1px solid"
              borderColor="gray.200"
              color="var(--dark)"
              fontSize="16px"
              fontWeight="500"
            >
              {eventData.description}
            </Text>
            <Text color="gray.600" fontSize="12px" fontWeight="400" mt="20px">
              {t("main.createdBy")}:
            </Text>
            <Text color="var(--dark)" fontSize="16px">
              {eventData.creator.name}
            </Text>
            {eventData.visibility === EVENT_VISIBILITY.PRIVATE && (
              <Text color="gray.600" fontSize="12px" fontWeight="400">
                *{t("pages.schedule.modals.event_details.isPrivate")}
              </Text>
            )}
          </ModalBody>
          <ModalFooter alignItems="flex-end">
            <Button
              type="button"
              onClick={onEventEditOpen}
              colorScheme="green"
              mr={3}
            >
              {t("buttons.edit")}
            </Button>
            <Button
              colorScheme="red"
              isLoading={isDeleteLoading}
              onClick={() => deleteEvent(eventData.id)}
            >
              {t("buttons.delete")}
            </Button>
            {isDeleteError && (
              <Text color="red" fontWeight="600" fontSize="18px">
                {t(
                  `errors.backendErrorLabel.${mapAxiosErrorToLabel(
                    deleteError
                  )}`
                )}
              </Text>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
      {isEventEditOpen && (
        <EventEditModal
          onClose={onEventEditClose}
          isOpen={isEventEditOpen}
          eventData={{
            ...eventData,
            startDate: new Date(eventData.startDate),
            endDate: new Date(eventData.endDate),
          }}
        />
      )}
    </>
  );
};
