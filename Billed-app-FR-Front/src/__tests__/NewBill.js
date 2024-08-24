/**
 * @jest-environment jsdom
 */

import { fireEvent, screen, waitFor } from "@testing-library/dom"
import NewBill from "../containers/NewBill.js"
import { localStorageMock } from "../__mocks__/localStorage.js"
import { mockStore } from "../__mocks__/store.js"
import { ROUTES_PATH } from "../constants/routes.js"
import { bills } from "../fixtures/bills"

import router from "../app/Router.js"
//jest.mock("../app/store", () => mockStore);

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    let newBill;

    beforeEach(() => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock });
      window.mockStore = mockStore;
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }));
      const root = document.createElement("div");
      root.setAttribute("id", "root");
      document.body.append(root);
      router();
      window.onNavigate(ROUTES_PATH.NewBill);

      // instantiation de newbills
      newBill = new NewBill({ document, onNavigate: window.onNavigate, store: mockStore, localStorage: window.localStorage });
    })

    test("Then the new bill form should be rendered", () => {
      expect(screen.getByTestId('form-new-bill')).toBeTruthy();
    })

    test("When I submit the form with valid data, it should create a new bill", async () => {
      const handleSubmit = jest.fn(newBill.handleSubmit)
      newBill.document.querySelector('form[data-testid="form-new-bill"]').addEventListener("submit", handleSubmit)

      fireEvent.change(screen.getByTestId('expense-type'), { target: { value: 'Transports' } })
      fireEvent.change(screen.getByTestId('expense-name'), { target: { value: 'Train Paris-Lyon' } })
      fireEvent.change(screen.getByTestId('datepicker'), { target: { value: '2021-09-01' } })
      fireEvent.change(screen.getByTestId('amount'), { target: { value: '50' } })
      fireEvent.change(screen.getByTestId('vat'), { target: { value: '20' } })
      fireEvent.change(screen.getByTestId('pct'), { target: { value: '20' } })
      fireEvent.change(screen.getByTestId('commentary'), { target: { value: 'Voyage pour une réunion' } })

      const form = screen.getByTestId('form-new-bill')
      fireEvent.submit(form)

      expect(handleSubmit).toHaveBeenCalled()
    })

    test("Then it should call handleChangeFile with an invalid file", () => {
      const fileInput = screen.getByTestId('file')
      const file = new File(['dummy content'], 'test.txt', { type: 'text/plain' })

      const handleChangeFile = jest.fn(newBill.handleChangeFile)
      fileInput.addEventListener('change', handleChangeFile)

      fireEvent.change(fileInput, { target: { files: [file] } })

      expect(handleChangeFile).toHaveBeenCalled()
      expect(newBill.fileUrl).toBeNull()
      expect(newBill.billId).toBeNull()
      expect(newBill.fileName).toBeNull()
    });
  })
})