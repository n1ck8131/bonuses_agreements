import React from "react";
import {
  Box,
  Container,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { createAgreement } from "../../api/client";
import { AgreementCreate } from "../../types/agreement";
import { useReferenceData } from "../../hooks/useReferenceData";
import { LoadingSpinner } from "../common/LoadingSpinner";
import { AgreementForm } from "./AgreementForm";

export const CreateAgreement: React.FC = () => {
  const navigate = useNavigate();
  const { suppliers, agreementTypes, scales, loading: refLoading } = useReferenceData();

  if (refLoading) {
    return <LoadingSpinner />;
  }

  const handleSubmit = async (data: AgreementCreate) => {
    await createAgreement(data);
    navigate("/agreements");
  };

  return (
    <Box sx={{ backgroundColor: "#F7F8FA", minHeight: "calc(100vh - 89px)", py: 4 }}>
      <Container maxWidth="md">
        <Paper sx={{ p: 4, border: "1px solid #EBEDF0" }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <IconButton
              onClick={() => navigate("/agreements")}
              sx={{
                mr: 1,
                width: 36,
                height: 36,
                backgroundColor: "#F7F8FA",
                border: "1px solid #EBEDF0",
                borderRadius: 2.5,
                color: "#5C6370",
                "&:hover": { backgroundColor: "#EBEDF0" },
              }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography
              variant="h4"
              sx={{
                fontFamily: '"Montserrat", sans-serif',
                fontWeight: 700,
                fontSize: "1.25rem",
                color: "#2C3140",
              }}
            >
              Создание соглашения
            </Typography>
          </Box>

          <AgreementForm
            suppliers={suppliers}
            agreementTypes={agreementTypes}
            scales={scales}
            onSubmit={handleSubmit}
            onCancel={() => navigate("/agreements")}
            submitLabel="Создать соглашение"
            loadingLabel="Создание..."
          />
        </Paper>
      </Container>
    </Box>
  );
};
