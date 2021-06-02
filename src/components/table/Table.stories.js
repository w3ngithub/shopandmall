import Table from ".";

export default {
  title: "Table",
  component: Table,
  args: {
    fields: [{ headerText: "Category", field: "category" }],
    hasAction: true,
  },
  argTypes: {
    backgroundColor: { control: "color" },
    headerTextColor: { control: "color" },
  },
  parameters: {
    design: [
      {
        name: "Figma",
        type: "figma",
        url:
          "https://www.figma.com/file/3BpvOEAoT1nT8jKZYj6Klb/Mall-and-shops?node-id=601%3A193",
      },
      {
        type: "link",
        url:
          "https://www.figma.com/file/3BpvOEAoT1nT8jKZYj6Klb/Mall-and-shops?node-id=601%3A193",
      },
    ],
  },
};

const TableTemplate = (args) => <Table {...args} />;

export const Small = TableTemplate.bind({});
Small.args = {
  rowData: [
    { id: 1, category: "Food" },
    { id: 2, category: "Movies" },
    { id: 3, category: "Shopping" },
  ],

  width: 33,
};
export const Medium = TableTemplate.bind({});

Medium.args = {
  rowData: [
    {
      id: 1,
      category: "Food",
      name: "dsddsd",
    },
    { id: 2, category: "Movies", name: "dsddsd" },
    { id: 3, category: "Shopping", name: "dsddsd" },
  ],
  fields: [
    { headerText: "Category", field: "category", width: 250 },
    { headerText: "Name", field: "name", width: 150 },
  ],
  width: 50,
  hasAction: true,
};
export const Large = TableTemplate.bind({});
Large.args = {
  rowData: [
    { id: 1, category: "Food", name: "dsddsd", subcategory: "Italian" },
    { id: 2, category: "Movies", name: "dsddsd", subcategory: "QFX" },
    { id: 3, category: "Shopping", name: "dsddsd", subcategory: "Glasses" },
  ],
  fields: [
    { headerText: "Category", field: "category", width: 450 },
    { headerText: "Name", field: "name", width: 350 },
    { headerText: "Subcategory", field: "subcategory", width: 350 },
  ],
  width: 100,
};

export const Nested = TableTemplate.bind({});

Nested.args = {
  rowData: [
    {
      id: 1,
      category: "Food",
      name: "dsddsd",
      rowContent: (
        <Table
          rowData={[
            {
              subCategory: "Food",
              id: 1,
            },
            {
              subCategory: "Movies",
              id: 2,
            },
            {
              subCategory: "Shopping",
              id: 3,
            },
          ]}
          fields={[
            {
              field: "subCategory",
              headerText: "Sub Category",
            },
          ]}
          onClick={() => {}}
          width={100}
          hasAction={false}
        />
      ),
    },
    { id: 2, category: "Movies", name: "dsddsd" },
    { id: 3, category: "Shopping", name: "dsddsd" },
  ],
  fields: [
    { headerText: "Category", field: "category", width: 250 },
    { headerText: "Name", field: "name", width: 150 },
  ],
  width: 50,
  hasAction: true,
  isNestedTable: true,
};
