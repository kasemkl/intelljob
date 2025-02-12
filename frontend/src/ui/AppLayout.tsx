import { Outlet } from "react-router-dom";
import styled from "styled-components";
import Sidebar from "../components/Sidebar";
import "../styles/variables.css";
import "../styles/main.css";

const StyledAppLayout = styled.div`
  min-height: 100vh;
  position: relative;
`;

const Main = styled.main`
  background-color: var(--background-tertiary);
  padding: 4rem 4.8rem 6.4rem;
  color: var(--text-primary);
  // border-left: 1px solid var(--border-light); /* Subtle separator */
`;

const Container = styled.div`
  max-width: 120rem;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 3.2rem;
`;

const AppLayout: React.FC = () => {
  return (
    <StyledAppLayout>
      <Sidebar />
      <Main className="home-section">
        <Container>
          <Outlet />
        </Container>
      </Main>
    </StyledAppLayout>
  );
};

export default AppLayout;
