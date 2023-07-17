/**
 * @jest-environment jsdom
 */

import NewBillUI from '../views/NewBillUI.js'
import NewBill from '../containers/NewBill.js'
import {screen, waitFor, fireEvent} from '@testing-library/dom'
import {ROUTES, ROUTES_PATH} from '../constants/routes.js'
import {localStorageMock} from '../__mocks__/localStorage.js'
import mockStore from '../__mocks__/store.js'
import router from '../app/Router.js'
import BillsUI from '../views/BillsUI.js'
import Bills from '../containers/Bills.js'

jest.mock("../app/store", () => mockStore)

describe("Given I am connected as an employee", () => {
  describe("When I am on the new bill page", () => {
    test("Then show the new bill page", async () => {
      localStorage.setItem("user", JSON.stringify({ type: "Employee", email: "a@a" }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.NewBill)
      expect(screen.getAllByText('Envoyer une note de frais')).toBeTruthy()
    })

    test("Then mail icon in vertical layout should be highlighted", async () => {
      localStorage.setItem("user", JSON.stringify({ type: "Employee", email: "a@a" }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router();
      window.onNavigate(ROUTES_PATH.NewBill);
      // vérifie que l'icone mail est bien sur active lorsque l'utilisateur visite la partie "nouvelle note"
      await waitFor(() => screen.getByTestId("icon-mail"))
      const mailIcon = screen.getByTestId("icon-mail")
      expect(mailIcon.className).toBe("active-icon")
    })
    
    describe("When I am sending a new bill and there is no error", () => {
      test("Then must save the bill", async () => {
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname })
        }
        Object.defineProperty(window, "localStorage", { value: localStorageMock })
        window.localStorage.setItem("user", JSON.stringify({
          type: "Employee"
        }))
        document.body.innerHTML = NewBillUI()
        const newBill = new NewBill({
          document, onNavigate, store: mockStore, localStorage: window.localStorage
        })
        // mock la création de la méthode handleSubmit et handleChangeFile avec event en argument
        const handleSubmit = jest.fn((e) => newBill.handleSubmit(e))
        const handleChangeFile = jest.fn((e) => newBill.handleChangeFile(e))
        // récupère les id test du message d'erreur présent sur l'interface du newbill
        const errorMessage = screen.getByTestId("error-message")
        // récupère les id test du bouton input pour le téléchargement du fichier image
        const inputButton = screen.getByTestId("file")
        // simule le changement de données avec le fichier test.jpg au click de l'utilisateur
        fireEvent.change(inputButton, {
          target: { // pour le test, charge un nom de fichier valide
            files: [new File(["test.jpg"], "test.jpg", { type: "image/jpg" })],//objet File de js : (bit, name, option)
          }, 
        })
        // récupère l'id test du formulaire newbill
        const formNewBill = screen.getByTestId("form-new-bill")
        formNewBill.addEventListener("submit", handleSubmit)
        //ajoute l'evènement "change" à l'input
        inputButton.addEventListener("change", () => { 
          // appelle la fonction mockée
          handleChangeFile
          // espère que le message d'erreur est vide
          expect(errorMessage.textContent).toContain('')
          // s'attend à que le nom du fichier chargé soit le même que celui indiqué par "l'utilisateur"
          expect(inputButton.files[0].name).toBe("test.jpg")
          }) 
        fireEvent.submit(formNewBill)
        // s'attend à que le formulaire existe 
        expect(formNewBill).toBeTruthy()
        // s'attend à que la fonction submit ai été appelé précédemment lors du click
        expect(handleSubmit).toHaveBeenCalled()
      })
    })

    describe("When I select a file with a bad format", () => {
      test("Then the user could see the alert's message", () => {
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname })
        }
        Object.defineProperty(window, "localStorage", { value: localStorageMock })
        window.localStorage.setItem("user", JSON.stringify({
          type: "Employee"
        }))
        document.body.innerHTML = NewBillUI()
        const newBill = new NewBill({
          document, onNavigate, store: mockStore, localStorage: window.localStorage
        })
        
        // mock dans la constance la méthode de l'objet newBill
        const handleChangeFile = jest.fn((e) => newBill.handleChangeFile(e))
        const inputButton = screen.getByTestId("file")
        const errorMessage = screen.getByTestId("error-message")
        inputButton.addEventListener("change", () => { 
          handleChangeFile
          }) 
        // simule le changement de données avec le fichier test.jpg au click de l'utilisateur
        fireEvent.change(inputButton, {
          target: {
            files: [new File(["test.txt"], "test.txt", { type: "text/txt" })],//objet File de js : (bit, name, option)
          }, 
        })
        
        expect(inputButton.files[0].name).toBe("test.txt")
        // s'attend à que le message d'erreur contient la phrase indiquée
        expect(errorMessage.textContent).toContain("Le format de votre justificatif n'est pas valide. Image acceptée : JPEG, JPG, PNG")
      })
    })
  })
})
