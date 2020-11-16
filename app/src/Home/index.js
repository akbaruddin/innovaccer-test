import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import { Row, Column, Card, Table } from '@innovaccer/design-system';
import { ajaxInstance } from '../api'
import Sidebar from '../Sidebar';
import './Home.css';

function Home(props) {
  const [tableData, setTableData] = useState([])
  const [nextCount, setNextCount] = useState(0);

  const translateData = (schema, data) => {
    let newData = data;

    if (schema.translate) {
      const translatedData = schema.translate(data);
      newData = {
        ...newData,
        [schema.name]: typeof translatedData === 'object' ? {
          ...newData[schema.name],
          ...translatedData
        } : translatedData
      };
    }
    if (typeof newData[schema.name] !== 'object') newData[schema.name] = { title: newData[schema.name] };

    return newData;
  }

  const filterData = (schema, data, filterList) => {
    let filteredData = data;
    if (filterList) {
      Object.keys(filterList).forEach(schemaName => {
        const filters = filterList[schemaName];
        const sIndex = schema.findIndex(s => s.name === schemaName);
        const { onFilterChange } = schema[sIndex];
        if (filters.length && onFilterChange) {
          filteredData = filteredData.filter(d => onFilterChange(d, filters));
        }
      });
    }

    return filteredData;
  };

  const sortData = (schema, data, sortingList) => {
    const sortedData = [...data];
    sortingList.forEach(l => {
      const sIndex = schema.findIndex(s => s.name === l.name);
      if (sIndex !== -1) {
        const defaultComparator = (a, b) => {
          const aData = translateData(schema[sIndex], a);
          const bData = translateData(schema[sIndex], b);
          return aData[l.name].title.localeCompare(bData[l.name].title);
        };

        const {
          comparator = defaultComparator
        } = schema[sIndex];

        sortedData.sort(comparator);
        if (l.type === 'desc') sortedData.reverse();
      }
    });

    return sortedData;
  };

  const schema = [
    {
      name: 'name',
      displayName: 'Name',
      width: 400,
      resizable: true,
      separator: true,
      tooltip: true,
      translate: a => ({
        title: `${a.firstName} ${a.lastName}`,
        firstName: a.firstName,
        lastName: a.lastName
      }),
      filters: [
        { label: 'A-G', value: 'a-g' },
        { label: 'H-R', value: 'h-r' },
        { label: 'S-Z', value: 's-z' },
      ],
      onFilterChange: (a, filters) => {
        for (const filter of filters) {
          switch (filter) {
            case 'a-g':
              if (a.firstName[0].toLowerCase() >= 'a' && a.firstName[0].toLowerCase() <= 'g') return true;
              break;
            case 'h-r':
              if (a.firstName[0].toLowerCase() >= 'h' && a.firstName[0].toLowerCase() <= 'r') return true;
              break;
            case 's-z':
              if (a.firstName[0].toLowerCase() >= 's' && a.firstName[0].toLowerCase() <= 'z') return true;
              break;
            default:
              return true
          }
        }
        return false;
      },
      cellType: 'AVATAR_WITH_TEXT',
    },
    {
      name: 'age',
      displayName: 'Age',
      width: 100,
      resizable: true,
      sorting: true,
      cellType: 'WITH_META_LIST'
    },
    {
      name: 'gender',
      displayName: 'Gender',
      width: 200,
      resizable: true,
      comparator: (a, b) => a.gender.localeCompare(b.gender),
      cellType: 'STATUS_HINT',
      translate: a => ({
        title: a.gender,
        statusAppearance: (a.gender === 'Female') ? 'alert' : 'success'
      }),
      filters: [
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' },
      ],
      onFilterChange: (a, filters) => {
        for (const filter of filters) {
          if (a.gender.toLowerCase() === filter) return true;
        }
        return false;
      },
    },
    {
      name: 'contact',
      displayName: 'Contact',
      width: 200,
      resizable: true,
      sorting: true,
      cellType: 'WITH_META_LIST'
    },
  ];

  const fetchData = (options) => {
    const {
      page,
      pageSize,
      sortingList,
      filterList,
      searchTerm
    } = options;

    const onSearch = (d, searchTerm = '') => {
      return (
        d.firstName.toLowerCase().match(searchTerm.toLowerCase())
        || d.lastName.toLowerCase().match(searchTerm.toLowerCase())
      );
      /* eslint-disable no-unreachable */
      return true;
      /* eslint-enable */
    }

    return ajaxInstance
      .get('patients?next=' + nextCount)
      .then(resp => {
        
        setTableData(resp.data.results);
        setNextCount(resp.data.next);
        const filteredData = filterData(schema, resp.data.results, filterList);
        const searchedData = filteredData.filter(d => onSearch(d, searchTerm));
        const sortedData = sortData(schema, searchedData, sortingList);
        
        if (page && pageSize) {
          return new Promise(resolve => {
            const start = (page - 1) * pageSize;
            const end = start + pageSize;
            const slicedData = sortedData.slice(start, end);

            resolve({
              schema,
              count: sortedData.length,
              data: slicedData,
            });
          })
        }
      }).catch(error => {
        const filteredData = filterData(schema, tableData, filterList);
        const searchedData = filteredData.filter(d => onSearch(d, searchTerm));
        const sortedData = sortData(schema, searchedData, sortingList);

        return new Promise(resolve => {
          const start = (page - 1) * pageSize;
          const end = start + pageSize;
          const slicedData = sortedData.slice(start, end);

          resolve({
            schema,
            count: sortedData.length,
            data: slicedData,
          });
        })
      });
  }

  const loaderSchema = [
    {
      "name": "name",
      "displayName": "Name",
      "width": "40%",
      "tooltip": true,
      "resizable": true,
      "separator": true,
      "filters": [
        {
          "label": "A-G",
          "value": "a-g"
        },
        {
          "label": "H-R",
          "value": "h-r"
        },
        {
          "label": "S-Z",
          "value": "s-z"
        }
      ],
      "cellType": "AVATAR_WITH_TEXT"
    },
    {
      "name": "age",
      "displayName": "Age",
      "width": 100,
      "resizable": true,
      "sorting": true,
      "cellType": "WITH_META_LIST"
    },
    {
      "name": "gender",
      "displayName": "Gender",
      "width": 180,
      "resizable": true,
      "cellType": "STATUS_HINT",
      "filters": [
        {
          "label": "Male",
          "value": "male"
        },
        {
          "label": "Female",
          "value": "female"
        }
      ]
    },
    {
      "name": "contact",
      "displayName": "Contact",
      "width": 200,
      "resizable": true,
      "sorting": true,
      "cellType": "WITH_META_LIST"
    }
  ];


  return (
    <div style={{ height: "100vh" }}>
      <Row className="h-100">
        <Column size={2}>
          <Sidebar  type="home"/>
        </Column>
        <Column size={10}>
          <Card className="h-100">
            <Table
              type="resource"
              loaderSchema={loaderSchema}
              fetchData={fetchData}
              withHeader={true}
              headerOptions={{
                withSearch: true
              }}
              onRowClick={(data, rowIndex) => {
                props.history.push(`/patients/${data._id}`)
              }}
              withPagination={true}
              pageSize={8}
              onPageChange={newPage => console.log(`on-page-change:- ${newPage}`)}
            />
          </Card>
        </Column>
      </Row>
    </div>
  )
}

export default withRouter(Home);
