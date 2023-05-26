import Intercom from '../models/Intercom.js';
import { errorResponse } from '../utils/utils.js';
import {
  alreadyRegistered,
  validateFullFields,
  validateNumberAnex,
  ValidatePasswordStrength,
} from '../utils/Validations.js';

const validateCreateIntercom = async (req, res, next) => {
  const { intercomNumber, password, intercomCaller, transportType, restriction } = req.body;

  if (!validateFullFields([intercomNumber, password, transportType, restriction])) {
    return errorResponse(res, 400, 'Por favor completa el formulario.');
  }
  if (restriction === 2 && !intercomCaller) {
    return errorResponse(res, 400, 'Selecciona el anexo de llamadas restringidas.');
  }
  if (!validateNumberAnex(intercomNumber, 20000, 29999)) {
    return errorResponse(res, 409, `El Anexo debe estar en el rango de 20000-29999.`, 'Intercom');
  }

  try {
    if (await alreadyRegistered(Intercom, 'intercom_number', intercomNumber)) {
      return errorResponse(res, 409, 'Intercomunicador ya registrado.', 'Intercom');
    }
    if (!ValidatePasswordStrength(password)) {
      return errorResponse(res, 409, 'La contraseña no cumple con los estándares de seguridad requeridos.', 'Password');
    }
    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

export { validateCreateIntercom };
