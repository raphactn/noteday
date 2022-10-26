import {
  Box,
  Text,
  useColorModeValue,
  CloseButton,
  useDisclosure,
} from "@chakra-ui/react";

export const WarningToast = () => {
  const { isOpen, onClose } = useDisclosure({defaultIsOpen: false});

  return (
    isOpen ? (
      <Box
        bg={useColorModeValue("gray.100", "gray.900")}
        p={5}
        rounded={"xl"}
        mb={5}
      >
        <CloseButton float={"right"} onClick={onClose} />
        <Text textAlign={"center"}>
          Evite usar o Notas com janela anônima/privada, ou suas notas
          não serão salvas no cache do navegador! O texto do Bloco de Notas pode
          ser excluído quando você exclui seu histórico de navegação/cache ou
          executa o aplicativo de limpeza de disco.
        </Text>
      </Box>
    ) : null
  );
};
