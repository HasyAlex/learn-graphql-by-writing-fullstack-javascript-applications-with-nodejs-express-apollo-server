import { useParams } from 'react-router';

import JobList from '../components/JobList';
import { useCompany } from '../lib/graphql/hooks';

function CompanyPage() {
  const { companyId } = useParams();

  const { company, loading, error } = useCompany(companyId);

  // const [state, setState] = useState({
  //   company: null,
  //   loading: true,
  //   error: false
  // });

  // useEffect(() => {
  //   (async () => {
  //     try{
  //       const company = await getCompanyById(companyId);
  //       setState({ company, loading: false, error: false})
  //     }catch(error){
  //       setState({ company:null, loading: false, error: true})
  //     }
  //   })();
  // }, [companyId]);
  // const { company, loading, error } = state;
  
  if (loading) {
    return <div>Loading...</div>
  }
  if (error) {
    return <div>Error..</div>
  }

  return (
    <div>
      <h1 className="title">
        {company.name}
      </h1>
      <div className="box">
        {company.description}
      </div>
      <div className="title is-5">
        Jobs at {company.name}
      </div>
      <JobList jobs={company.jobs} />
    </div>
  );
}

export default CompanyPage;
