import { Page, SecuredLayout } from "@/shared/components";


const Dashboard: React.FC = () => {
    return (
        <Page title="BidBox">
            <SecuredLayout>
                <h1>
                    <strong>Dashboard</strong>
                </h1>
            </SecuredLayout>
        </Page>
    );
};

export default Dashboard;
