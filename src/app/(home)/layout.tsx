import Footer from "@/components/shared/footer";
import Header from "@/components/shared/header";
import { Toaster } from 'sonner'


export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex flex-col">
        {children}
         <Toaster richColors position="top-right" />

        </main>
      <Footer />
    </div>
  );
}
// translate and give result in urdu. sections examined reveal partly stratified
//  squamous mucosa covered tissue exhibiting an infiltrating neoplastic lesion
//  arrange in the form of solid clusters as well as
//   adenoid pattern with central lumina.lening epithelial cells show moderate
//    amount of cytoplasm,prominant nucleoli showing scattered mitosis.tumor cells
//     are positive for immunohistochemical stain p40.scattered dyskeratotic also
//     appreciated.  diagnosis : vocal cord: moderately defferentiated focally
//     keratinizing cells squamous cell carcinoma
