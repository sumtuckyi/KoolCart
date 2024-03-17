import axios from "axios";

const REGULAR_API_BASE_URL = "/api/regular";

class RegularService {
  /**
   * 사용자 ID에 해당하는 모든 정기배송 목록을 가져옵니다.
   * @param {number} userSeq - 조회할 사용자의 고유 ID
   * @returns {Promise} - 정기배송 정보 목록을 반환하는 Promise
   */
  getRegularsByUser(userSeq) {
    return axios.get(`${REGULAR_API_BASE_URL}/list/${userSeq}`);
  }

  /**
   * 특정 정기배송 정보를 업데이트합니다.
   * @param {number} rdSeq - 업데이트할 정기배송의 ID
   * @param {Object} regularDTO - 업데이트할 정기배송 정보
   * @returns {Promise} - 업데이트 결과를 반환하는 Promise
   */
  updateRegular(rdSeq, regularDTO) {
    console.log(regularDTO);
    return axios.put(`${REGULAR_API_BASE_URL}/update/${rdSeq}`, regularDTO);
  }

  /**
   * 특정 정기배송을 해지합니다.
   * @param {number} rdSeq - 해지할 정기배송의 ID
   * @returns {Promise} - 해지 결과를 반환하는 Promise
   */
  terminateRegular(rdSeq) {
    return axios.get(`${REGULAR_API_BASE_URL}/delete/${rdSeq}`);
  }

  /**
   * 새로운 정기배송을 등록합니다.
   * @param {object} regularDTO 등록할 정기배송 정보
   * @returns {Promise} - 생성 결과를 반환하는 Promise
   */
  writeRegular(regularDTO) {
    console.log(regularDTO);
    return axios.post(`${REGULAR_API_BASE_URL}/write`, regularDTO);
  }
}

export default new RegularService();
