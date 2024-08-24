/**
 * @jest-environment jsdom
 */

import {screen, waitFor, fireEvent} from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import { ROUTES_PATH} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store";
import router from "../app/Router.js";
import Bills from "../containers/Bills.js";

jest.mock("../app/store", () => mockStore);



describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    /*
    beforeEach(() => {
      jest.spyOn(mockStore, "bills");
      Object.defineProperty(window, 'localStorage', { value: localStorageMock });
      const user = {
        type: "Employee"
      };
      window.localStorage.setItem('user', JSON.stringify(user));
      const root = document.createElement("div");
      root.setAttribute("id", "root");
      document.body.append(root);
      router();
      window.onNavigate(ROUTES_PATH.Bills);
    });
    */

    beforeEach(() => {
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );
      const root = document.createElement("div");
          root.setAttribute("id", "root");
          document.body.append(root);
          router();
          window.onNavigate(ROUTES_PATH.Bills);
    
    });

    test("Then bill icon in vertical layout should be highlighted", async () => {
      await waitFor(() => screen.getAllByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')
      expect(windowIcon.classList.contains('active-icon')).toBe(true);
    })
    
    
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills.sort((a, b) => new Date(b.date) - new Date(a.date)) });
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })


    test("When I click on the new bill button, it should navigate to NewBill page", async () => {
      await waitFor(() => screen.getAllByTestId('btn-new-bill'));
      const newBillButton = screen.getAllByTestId('btn-new-bill')[0];
      newBillButton.addEventListener('click', () => window.onNavigate(ROUTES_PATH.NewBill));
      fireEvent.click(newBillButton);
      window.onNavigate(ROUTES_PATH.Bills);
    });

    test("Then a modal should open", () => {
      document.body.innerHTML = BillsUI({ data: bills });
      window.onNavigate(ROUTES_PATH.Bills);

      const bill = new Bills({
        document,
        onNavigate,
        store: null,
        localStorage: window.localStorage,
      });
      // test un seul icon
      const eyeIcons = screen.getAllByTestId("icon-eye");
      const handleClickIconEye = jest.fn(bill.handleClickIconEye);

      const modale = document.getElementById("modaleFile");
      $.fn.modal = jest.fn(() => modale.classList.add("show"));

      eyeIcons.forEach(icon => {
        icon.addEventListener("click", () => handleClickIconEye(icon));
        fireEvent.click(icon);
        expect(handleClickIconEye).toHaveBeenCalled();
      });
    });
  })
    
  
  // TEST ERREURS
  describe("When an error occurs on API", () => {
    beforeEach(() => {
      jest.spyOn(mockStore, "bills");
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
          email: "a@a",
        })
      );
      const root = document.createElement("div");
      root.setAttribute("id", "root");
      document.body.appendChild(root);
      router();
    });
    test("fetches bills from an API and fails with 404 message error", async () => {
      mockStore.bills.mockImplementationOnce(() => {
        return {
          list: () => {
            return Promise.reject(new Error("Erreur 404"));
          },
        };
      });
      window.onNavigate(ROUTES_PATH.Bills);
      await new Promise(process.nextTick);
      const message = await screen.getByText(/Erreur 404/);
      expect(message).toBeTruthy();
    });

    test("fetches messages from an API and fails with 500 message error", async () => {
      mockStore.bills.mockImplementationOnce(() => {
        return {
          list: () => {
            return Promise.reject(new Error("Erreur 500"));
          },
        };
      });

      window.onNavigate(ROUTES_PATH.Bills);
      await new Promise(process.nextTick);
      const message = await screen.getByText(/Erreur 500/);
      expect(message).toBeTruthy();
    });
  });
  /*
  describe("When an error occurs on API", () => {
    test("fetches bills from an API and fails with 404 message error", async () => {
      mockStore.bills.mockImplementationOnce(() => {
        return {
          list : () =>  {
            return Promise.reject(new Error("Erreur 404"))
          }
        }})
      window.onNavigate(ROUTES_PATH.Bills)
      await new Promise(process.nextTick);
      const message = await screen.getByText(/Erreur 404/)
      expect(message).toBeTruthy()
    })

    test("fetches messages from an API and fails with 500 message error", async () => {
      mockStore.bills.mockImplementationOnce(() => {
        return {
          list : () =>  {
            return Promise.reject(new Error("Erreur 500"))
          }
        }})

      window.onNavigate(ROUTES_PATH.Bills)
      await new Promise(process.nextTick);
      const message = await screen.getByText(/Erreur 500/)
      expect(message).toBeTruthy()
    })
  })
  */
})


/*
beforeEach(() => {
  // Configuration du localStorage avec un utilisateur connecté
  Object.defineProperty(window, 'localStorage', { value: localStorageMock });
  const user = {
    type: "Employee",
    email: "employee@test.tld",
    password: "employee",
    status: "connected"
  };
  window.localStorage.setItem('user', JSON.stringify(user));

  // Création de l'élément racine pour le DOM
  const root = document.createElement("div");
  root.setAttribute("id", "root");
  document.body.append(root);

  // Configuration du routeur
  router();

  // Navigation vers la page des factures
  window.onNavigate(ROUTES_PATH.Bills);
});
*/


    /*
    test("Then eyes icon is present", async () => {

      let billsContainer = new Bills({
        document, onNavigate, store: mockStore, localStorage: window.localStorage
      });
    
      // Attendre que l'icône de l'œil soit disponible
      await waitFor(() => screen.getAllByTestId('icon-eye'));
      
      // Récupérer l'icône de l'œil
      const iconsEye = screen.getAllByTestId('icon-eye');
      
      // Simuler un clic sur l'icône de l'œil
      const handleClickIconEye = jest.fn((icon) => billsContainer.handleClickIconEye(icon));
    
    
      iconsEye.forEach(icon => {
        icon.addEventListener("click", handleClickIconEye(icon));
        fireEvent.click(icon);
        expect(handleClickIconEye).toHaveBeenCalledWith(icon);
        //expect(document.getElementById('modaleFile')).toBeTruthy();
      });
    });
    */



    /*
    test("Then a modal should open", () => {
      document.body.innerHTML = BillsUI({ data: bills });
      window.onNavigate(ROUTES_PATH.Bills);

      const bill = new Bills({
        document,
        onNavigate,
        store: null,
        localStorage: window.localStorage,
      });
      // test un seul icon
      const eyeIcons = screen.getAllByTestId("icon-eye");
      const handleClickIconEye = jest.fn(bill.handleClickIconEye);

      const modale = document.getElementById("modaleFile");
      $.fn.modal = jest.fn(() => modale.classList.add("show"));

      eyeIcons.forEach(icon => {
        icon.addEventListener("click", () => handleClickIconEye(icon));
        userEvent.click(icon);
        expect(handleClickIconEye).toHaveBeenCalled();
      });
    });
    */