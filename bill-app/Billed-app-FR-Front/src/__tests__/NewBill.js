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


// données des notes pour tester avec la simulation : remplir les champs inputs avec ces données
const testBill = {
  id: '47qAXb6fIm2zOKkLzMro',
  vat: '80',
  type: 'Hôtel et logement',
  commentary: 'séminaire billed',
  name: 'encore',
  file: 'preview-facture-free-201801-pdf-1.jpg',
  date: '2004-04-04',
  amount: 400,
  email: 'a@a',
  pct: 20
}

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

//Test d'intégration POST
describe('Given I am connected as an employee', () => {
  describe('When i submit a form', () => {
    test('Then it should generate a new bill if it valid', async () => {
      // initialise le local storage avec les identifiants employée
      localStorage.setItem("user", JSON.stringify({ type: "Employee", email: "a@a" }));
      document.body.innerHTML = NewBillUI()
      // stock dans la constante l'objet NewBill 
      const newBill = new NewBill({document, onNavigate, store: mockStore, localStorage: window.localStorage})
      const buttonSendBill = screen.getByTestId("form-new-bill")
      const handleSubmit = jest.fn(newBill.handleSubmit)
      buttonSendBill.addEventListener("submit", handleSubmit)
      fireEvent.submit(buttonSendBill)
      // s'attend à ce que handlesubmit ai été appelé
      expect(handleSubmit).toHaveBeenCalled()

      // Déclare les constantes qui stockent les id des champs au sein de l'interface new bill
      const formNewBill = screen.getByTestId("form-new-bill")
      const type = screen.getByTestId("expense-type")
      const name = screen.getByTestId("expense-name")
      const amount = screen.getByTestId("amount")
      const date = screen.getByTestId("datepicker")
      const vat = screen.getByTestId("vat")
      const pct = screen.getByTestId("pct")
      const commentary = screen.getByTestId("commentary")
      const fileButton = screen.getByTestId("file")

      const handleChangeFile = jest.fn((e) => newBill.handleChangeFile(e))
      fileButton.addEventListener("change", handleChangeFile)

      // mise à jour des champs au click utilisateur avec les valeurs 
      // contenu dans la constante déclaré au début
      fireEvent.change(type, {
        target: {value: testBill.type}
      })

      fireEvent.change(name, {
        target: {value: testBill.name}
      })

      fireEvent.change(amount, {
        target: {value: testBill.amount}
      })

      fireEvent.change(date, {
        target: {value: testBill.date}
      })

      fireEvent.change(vat, {
        target: {value: testBill.vat}
      })

      fireEvent.change(pct, {
        target: {value: testBill.pct}
      })

      fireEvent.change(commentary, {
        target: {value: testBill.commentary}
      })
      // Simule l'action de charger un fichier dans le champ
      fireEvent.change(fileButton, {
        target: {files: [new File(["test.jpg"], "test.jpg", { type: "image/jpg" })],
        },
      })
      // ajoute l'écouteur et déclenche la fonction submit
      formNewBill.addEventListener("submit", handleSubmit)
      fireEvent.submit(formNewBill)
      // s'attend a que la fonction soit bien appellée
      expect(handleSubmit).toHaveBeenCalled()

      // mock l'affichage de l'ensemble des notes pour vérifier si la note nouvelle créee 
      // est présente en leur sein
      const mockedBills = new Bills({document, onNavigate, store: mockStore, localStorage: window.localStorage})
      const bills = await mockedBills.getBills()
      // verifie si la première note de la liste affichée des notes 
      // a bien le même nom que la note nouvellement crée
      expect(bills[0].name).toContain(testBill.name)
    })
  })
})
