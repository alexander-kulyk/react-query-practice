import './App.css';
import axios from 'axios';
import { QueryFunctionContext, useQuery } from 'react-query';

function App() {
  const getPeople = async () => {
    const response = await axios.get('https://swapi.dev/api/people/');
    return response.data.results[0].url;
  };

  const getPerson = async ({
    queryKey,
  }: QueryFunctionContext<[string, string]>) => {
    const [, url] = queryKey;
    const response = await axios.get(url);
    return response.data;
  };

  const getStarShips = async ({
    queryKey,
  }: QueryFunctionContext<[string, string[]]>) => {
    const [, urls] = queryKey;
    const responses = await Promise.all(urls.map((url) => axios.get(url)));
    return responses.map((response) => response.data);
  };

  const getHomeWorld = async ({
    queryKey,
  }: QueryFunctionContext<[string, string]>) => {
    const [, url] = queryKey;
    const response = await axios.get(url);
    return response.data;
  };

  const {
    error,
    data: url,
    isLoading: isLoadingPeople,
    isError: isErrorPeople,
  } = useQuery({
    queryKey: ['people'],
    queryFn: getPeople,
    staleTime: 5 * 60 * 1000,
  });

  const {
    data: person,
    isLoading: isLoadingPerson,
    isError: isErrorPerson,
  } = useQuery({
    queryKey: ['person', url],
    queryFn: getPerson,
    enabled: !!url,
  });

  const {
    data: starShips,
    isLoading: isLoadingShips,
    isError: isErrorShips,
  } = useQuery({
    queryKey: ['starShips', person?.starships || []],
    queryFn: getStarShips,
    enabled: !!person,
  });

  const {
    data: homeWorld,
    isLoading: isLoadingHomeWorld,
    isError: isErrorHomeWorld,
  } = useQuery({
    queryKey: ['homeWorld', person?.homeworld],
    queryFn: getHomeWorld,
    enabled: !!person,
  });

  const isLoading =
    isLoadingHomeWorld || isLoadingPeople || isLoadingPerson || isLoadingShips;

  const isError =
    isErrorHomeWorld || isErrorPeople || isErrorPerson || isErrorShips;

  return (
    <div className='App'>
      {isLoading ? (
        <h1>Loading...</h1>
      ) : isError ? (
        <h1>
          {/* @ts-ignore */}
          Error: <span style={{ color: 'red' }}>{error.message}</span>
        </h1>
      ) : (
        <>
          <h1>{person?.name}</h1>
          <ul style={{ listStyle: 'none' }}>
            <li>
              Starships: {starShips?.map((item) => item.model).join(', ')}
            </li>
            <li>HomeWorld: {homeWorld?.name} </li>
            <li>Hair_color: {person?.hair_color} </li>
            <li>Eye_color: {person?.eye_color} </li>
            <li>Gender: {person?.gender} </li>
            <li>Height : {person?.height} </li>
          </ul>
        </>
      )}
    </div>
  );
}

export default App;
